import type React from 'react';
import CostSVG from '@/parcels/tcg/dlc/icons/other/cost.svg?react';
import ExertSVG from '@/parcels/tcg/dlc/icons/other/exert.svg?react';
import InkSVG from '@/parcels/tcg/dlc/icons/other/ink.svg?react';
import LoreSVG from '@/parcels/tcg/dlc/icons/other/lore.svg?react';
import StrengthSVG from '@/parcels/tcg/dlc/icons/other/strength.svg?react';
import WillpowerSVG from '@/parcels/tcg/dlc/icons/other/willpower.svg?react';

type DlcOtherSymbol = 'cost' | 'exert' | 'ink' | 'lore' | 'strength' | 'willpower';

export function DlcOtherSymbolSVG({
  symbol,
  size,
  ...others
}: React.ComponentPropsWithoutRef<'svg'> & { symbol: DlcOtherSymbol; size: number }) {
  switch (symbol) {
    case 'cost':
      return <CostSVG width={size} height={size} {...others} />;
    case 'exert':
      return <ExertSVG width={size} height={size} {...others} />;
    case 'ink':
      return <InkSVG width={size} height={size} {...others} />;
    case 'lore':
      return <LoreSVG width={size} height={size} {...others} />;
    case 'strength':
      return <StrengthSVG width={size} height={size} {...others} />;
    case 'willpower':
      return <WillpowerSVG width={size} height={size} {...others} />;
  }
}
