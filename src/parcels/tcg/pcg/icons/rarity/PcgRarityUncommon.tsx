import type React from 'react';

interface PcgRarityIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export function PcgRarityUncommon({ size, style, ...others }: PcgRarityIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" {...others}>
      <title>pcg-rarity-uncommon</title>
      <path d="M7 14L0 7l7-7 7 7z" />
    </svg>
  );
}
