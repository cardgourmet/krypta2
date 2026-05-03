import type React from 'react';

interface PcgRarityIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export function PcgRarityCommon({ size, style, ...others }: PcgRarityIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" {...others}>
      <title>pcg-rarity-common</title>
      <circle cx="6.5" cy="6.5" r="6.5" />
    </svg>
  );
}
