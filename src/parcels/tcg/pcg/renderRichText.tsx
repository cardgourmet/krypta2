import type { ReactElement, ReactNode } from 'react';
import reactStringReplace from 'react-string-replace';
import { type PcgSymbol, PcgSymbolSVG } from '@/parcels/tcg/pcg/details/PcgSymbolSVG.tsx';

export function renderRichPcgText(line: string, useFont?: boolean): ReactElement {
  let formattedLine: ReactNode[] = [line];
  const symbolRegex = /\{(?<symbol>.+?)}/g;

  const symbolMatch: Record<string, PcgSymbol> = {
    C: 'colorless',
  };

  if (useFont) {
    formattedLine = reactStringReplace(formattedLine, symbolRegex, (match, index) => {
      return (
        <span key={match + index} style={{ fontFamily: 'ptcg-font' }}>
          {match}
        </span>
      );
    });
  } else {
    formattedLine = reactStringReplace(formattedLine, symbolRegex, (match, index) => {
      const symbol = match.length === 1 ? (symbolMatch[match] ?? match) : match;

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
          <PcgSymbolSVG symbol={symbol as PcgSymbol} size={16} />
        </span>
      );
    });
  }

  return <>{formattedLine}</>;
}
