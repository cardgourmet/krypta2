import type { ReactElement, ReactNode } from 'react';
import reactStringReplace from 'react-string-replace';
import { type DlcOtherSymbol, DlcOtherSymbolSVG } from '@/parcels/tcg/dlc/details/DlcOtherSymbolSVG.tsx';

export function renderRichDlcText(line: string, withKeyword?: string): ReactElement {
  let formattedLine: ReactNode[] = [line];
  const symbolRegex = /\{(?<symbol>.+?)}/g;
  const newLineRegex = /\n/g;

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
        <DlcOtherSymbolSVG symbol={match as DlcOtherSymbol} size={16} />
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

  if (withKeyword) {
    formattedLine = reactStringReplace(formattedLine, withKeyword, (match, index) => {
      return (
        <strong key={match + index} style={{ fontWeight: '600' }}>
          {match}
        </strong>
      );
    });
  }

  formattedLine = reactStringReplace(formattedLine, symbolRegex, (match, index) => (
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
      <DlcOtherSymbolSVG symbol={match as DlcOtherSymbol} size={16} />
    </span>
  ));

  formattedLine = reactStringReplace(formattedLine, newLineRegex, (match) => {
    return (
      <span>
        <br />
        {match}
        <br />
      </span>
    );
  });

  return <>{formattedLine}</>;
}
