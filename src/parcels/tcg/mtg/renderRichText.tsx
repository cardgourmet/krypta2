import type {ReactElement, ReactNode} from 'react';
import reactStringReplace from 'react-string-replace';
import {MtgSymbolSVG} from '@/parcels/tcg/mtg/details/MtgSymbolSVG/MtgSymbolSVG.tsx';

export function renderRichText(line: string): ReactElement {
  let formattedLine: ReactNode[] = [line];
  const symbolRegex = /\{(?<symbol>.+?)}/g;

  formattedLine = reactStringReplace(formattedLine, /\((.*?)\)/g, (match, index) => {
    const innerRichContent = reactStringReplace(match, symbolRegex, (match, index) => (
      <span
        key={match + index}
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
          height: '21px' /* idk why: 'calc(1rem * var(--mantine-line-height-md))' doesnt work ...*/,
          marginLeft: '0.15rem',
          marginRight: '0.15rem',
        }}
      >
        <MtgSymbolSVG symbol={`{${match}}`} size={16} />
      </span>
    ));

    return (
      <em key={match + index} style={{ color: 'var(--gourmet-neutral-6)' }}>
        (
        {innerRichContent.map((node, index) =>
          typeof node === 'string' && !!node ? <span key={node + index}>{node}</span> : node,
        )}
        )
      </em>
    );
  });

  formattedLine = reactStringReplace(formattedLine, symbolRegex, (match, index) => {
    return (
      <span
        key={match + index}
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
          height: '21px' /* idk why: 'calc(1rem * var(--mantine-line-height-md))' doesnt work ...*/,
          marginLeft: '0.15rem',
          marginRight: '0.15rem',
        }}
      >
        <MtgSymbolSVG symbol={`{${match}}`} size={16} />
      </span>
    );
  });

  return <>{formattedLine}</>;
}
