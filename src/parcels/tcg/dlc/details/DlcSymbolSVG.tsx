import {DlcInkAmber} from '@/parcels/tcg/dlc/icons/DlcInkAmber.tsx';
import {DlcInkAmethyst} from '@/parcels/tcg/dlc/icons/DlcInkAmethyst.tsx';
import {DlcInkEmerald} from '@/parcels/tcg/dlc/icons/DlcInkEmerald.tsx';
import {DlcInkRuby} from '@/parcels/tcg/dlc/icons/DlcInkRuby.tsx';
import {DlcInkSapphire} from '@/parcels/tcg/dlc/icons/DlcInkSapphire.tsx';
import {DlcInkSteel} from '@/parcels/tcg/dlc/icons/DlcInkSteel.tsx';
import type {components as c} from '@/schema/api';

type DlcSymbol = c['schemas']['DlcDataCard']['inkTypes'][number];

export function DlcSymbolSVG({ symbol, size }: { symbol: DlcSymbol; size: number }) {
  switch (symbol) {
    case 'amber':
      return <DlcInkAmber size={size} color={'#f0b11d'} />;
    case 'amethyst':
      return <DlcInkAmethyst size={size} color={'#80397b'} />;
    case 'emerald':
      return <DlcInkEmerald size={size} color={'#2b8a42'} />;
    case 'ruby':
      return <DlcInkRuby size={size} color={'#d02031'} />;
    case 'sapphire':
      return <DlcInkSapphire size={size} color={'#0b87c1'} />;
    case 'steel':
      return <DlcInkSteel size={size} color={'#9da7b1'} />;
  }
}
