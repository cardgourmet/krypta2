import type { DroppedData } from '@/parcels/generic/Dropzone.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function extractScryfallInfo(tcg: Tcg | undefined, data: DroppedData): string | undefined {
  if (tcg !== 'mtg') return undefined;

  const id = extractIdJustLikeMoxfieldDoes(data.html, data.uriList);
  return id ?? undefined;
}

// Previously we had a custom extracting function, but as soon as we saw how Moxfield does it
// we knew: We had to do it that way as well. The variable names are kept original.
const extractIdJustLikeMoxfieldDoes = (t: string, o: string) => {
  let n = null;

  const r = new RegExp(/src="(.*?)"/gi).exec(t);

  n = null == r ? void 0 : r[1];
  const l = n !== null ? n : o;
  if (l === null || l === undefined) return null;
  if (l.length <= 0) return null;

  const s = new RegExp(/\/([^/]*?)\.(jpg|png)\?/gi).exec(l);
  const c = s === null ? undefined : s[1];
  /*const d = new RegExp(/https:\/\/scryfall.com\/card\/(.+)\/(.+)\/.*!/gi).exec(l);
  const u = d === null ? undefined : d[1];
  const m = d === null ? undefined : d[2];*/

  return c;
};
