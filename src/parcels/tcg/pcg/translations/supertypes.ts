import type { components as c } from '@/schema/api';

export const pcgSupertypesMapping = {
  pokemon: 'Pokémon',
  trainer: 'Trainer',
  energy: 'Energy',
} as Record<c['schemas']['PcgDataCard']['superType'], string>;
