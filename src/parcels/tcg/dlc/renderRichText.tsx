import type { ReactElement, ReactNode } from 'react';
import reactStringReplace from 'react-string-replace';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';

export function renderRichDlcText(line: string, withKeyword?: string): ReactElement {
  let formattedLine: ReactNode[] = [line];

  formattedLine = reactStringReplace(formattedLine, /\((.*?)\)/g, (match, index) => {
    return (
      <Typeset asChild key={match + index} variant="tertiary">
        <em>({match})</em>
      </Typeset>
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

  return <>{formattedLine}</>;
}
