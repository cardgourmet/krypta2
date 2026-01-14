import snarkdown from 'snarkdown';

const quotedRegexp = /(?<quoted>"(?:\\"|[^"])*")/g;

export function parseSearchExplanation(explanation: string) {
  // we need to filter out the quotes and replace them, because otherwise
  // markdown will render it out and it gets removed basically.
  const quoted = Array.from(explanation.matchAll(quotedRegexp)).map((match) => match.groups?.quoted);
  const unquoted = quoted.reduce((s, match, index) => {
    if (!s || !match) return s;

    return s.replace(match, `§${index}`);
  }, explanation);
  if (!unquoted) {
    return explanation;
  }

  const parsed = snarkdown(unquoted);
  return quoted.reduce((s, match, index) => {
    if (!s || !match) return s;

    return s.replace(`§${index}`, match);
  }, parsed);
}
