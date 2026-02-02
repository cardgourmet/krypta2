import type React from 'react';

interface PcgRarityIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export function PcgRarityRare({ size, style, ...others }: PcgRarityIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" {...others}>
      <title>pcg-rarity-rare</title>
      <path d="M8 0l1.903 5.704h6.02l-4.862 3.592L12.858 15l-4.859-3.486L3.14 15l1.796-5.704L.077 5.704h6.02z" />
    </svg>
  );
}
