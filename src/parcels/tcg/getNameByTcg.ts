import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function getNameByTcg(tcg: Tcg) {
  if (tcg === 'mtg') return 'Magic: The Gathering';
  else if (tcg === 'pcg') return 'Pokémon Card Game';
  else if (tcg === 'dlc') return 'Disney Lorcana';
  else {
    return 'Unknown';
  }
}
