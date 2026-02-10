import type {ReactElement, ReactNode} from 'react';
import reactStringReplace from 'react-string-replace';

export function renderRichDlcText(line: string, withKeyword?: string): ReactElement {
  let formattedLine: ReactNode[] = [line];

  formattedLine = reactStringReplace(formattedLine, /\((.*?)\)/g, (match, index) => {
    return (
      <em key={match + index} style={{ color: 'var(--gourmet-neutral-6)' }}>
        ({match})
      </em>
    );
  });

  if (withKeyword) {
    formattedLine = reactStringReplace(formattedLine, withKeyword, (match, index) => {
      return <b key={match + index}>{match}</b>;
    });
  }

  return <>{formattedLine}</>;
}
