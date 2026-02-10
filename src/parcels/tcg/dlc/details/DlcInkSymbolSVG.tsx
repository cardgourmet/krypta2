import {DlcInkAmber} from '@/parcels/tcg/dlc/icons/ink/DlcInkAmber.tsx';
import {DlcInkAmethyst} from '@/parcels/tcg/dlc/icons/ink/DlcInkAmethyst.tsx';
import {DlcInkEmerald} from '@/parcels/tcg/dlc/icons/ink/DlcInkEmerald.tsx';
import {DlcInkRuby} from '@/parcels/tcg/dlc/icons/ink/DlcInkRuby.tsx';
import {DlcInkSapphire} from '@/parcels/tcg/dlc/icons/ink/DlcInkSapphire.tsx';
import {DlcInkSteel} from '@/parcels/tcg/dlc/icons/ink/DlcInkSteel.tsx';
import type {components as c} from '@/schema/api';

type DlcInkSymbol = c['schemas']['DlcDataCard']['inkTypes'][number];

export function DlcInkSymbolSVG({ symbol, size }: { symbol: DlcInkSymbol; size: number }) {
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
