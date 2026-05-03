import {PcgEnergyColorless} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyColorless.tsx';
import {PcgEnergyDarkness} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyDarkness.tsx';
import {PcgEnergyDragon} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyDragon.tsx';
import {PcgEnergyFairy} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyFairy.tsx';
import {PcgEnergyFighting} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyFighting.tsx';
import {PcgEnergyFire} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyFire.tsx';
import {PcgEnergyGrass} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyGrass.tsx';
import {PcgEnergyLightning} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyLightning.tsx';
import {PcgEnergyMetal} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyMetal.tsx';
import {PcgEnergyPsychic} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyPsychic.tsx';
import {PcgEnergyWater} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyWater.tsx';
import type {components as c} from '@/schema/api';

export type PcgSymbol = c['schemas']['PcgDataCard']['types'][number];

export function PcgSymbolSVG({ symbol, size }: { symbol: PcgSymbol; size: number }) {
  switch (symbol) {
    case 'colorless':
      return <PcgEnergyColorless size={size} />;
    case 'darkness':
      return <PcgEnergyDarkness size={size} />;
    case 'dragon':
      return <PcgEnergyDragon size={size} />;
    case 'fairy':
      return <PcgEnergyFairy size={size} />;
    case 'fighting':
      return <PcgEnergyFighting size={size} />;
    case 'fire':
      return <PcgEnergyFire size={size} />;
    case 'grass':
      return <PcgEnergyGrass size={size} />;
    case 'lightning':
      return <PcgEnergyLightning size={size} />;
    case 'metal':
      return <PcgEnergyMetal size={size} />;
    case 'psychic':
      return <PcgEnergyPsychic size={size} />;
    case 'water':
      return <PcgEnergyWater size={size} />;
  }
}
