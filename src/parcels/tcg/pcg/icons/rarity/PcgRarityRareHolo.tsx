import type React from 'react';

interface PcgRarityIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export function PcgRarityRareHolo({ size, style, ...others }: PcgRarityIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="15" {...others}>
      <title>pcg-rarity-rare-holo</title>
      <path d="M7.966 0L9.87 5.704h6.02l-4.862 3.592L12.825 15l-4.859-3.486L3.106 15l1.796-5.704L.044 5.704h6.02z" />
      <path d="M23.397 2h1.559v12h-1.56V8.424h-3.948V14H17.89V2h1.558v5.074h3.948z" aria-label="H" />
    </svg>
  );
}
