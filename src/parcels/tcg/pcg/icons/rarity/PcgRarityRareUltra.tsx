import type React from 'react';

interface PcgRarityIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export function PcgRarityRareUltra({ size, style, ...others }: PcgRarityIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="15" {...others}>
      <title>pcg-rarity-rare-ultra</title>
      <path
        fill="#e5bd28"
        d="M8.169 0l1.902 5.704h6.022l-4.86 3.592L13.031 15 8.17 11.514 3.311 15l1.796-5.704-4.86-3.592h6.02z"
      />
      <path
        d="M21.38 14q-1.643 0-2.474-.932-.813-.932-.813-2.95V2h1.525v7.983q0 1.339.39 2.017.39.661 1.407.661 1.05 0 1.423-.678.39-.695.39-2V2h1.526v8.119q0 1.983-.848 2.932-.847.949-2.525.949z"
        aria-label="U"
      />
    </svg>
  );
}
