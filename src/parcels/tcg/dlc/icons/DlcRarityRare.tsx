import { rem } from '@mantine/core';
import type React from 'react';

interface DlcRarityIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export function DlcRarityRare({ size, style, ...others }: DlcRarityIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 168.87 136.99"
      fill="currentColor"
      stroke="currentColor"
      style={{ width: rem(size), height: rem(size), strokeWidth: 0, ...style }}
      {...others}
    >
      <title>dlc-rarity-rare</title>
      <path
        className="cls-1"
        d="m90.88,136.99h-13.49c-2.57-27.88-13.55-51.87-34.28-71.02C56.65,43.99,69.88,22.54,83.77,0c13.82,22.2,27.17,43.65,40.87,65.65-20.11,19.65-32.55,42.97-33.76,71.34Z"
      />
      <path
        className="cls-1"
        d="m168.87,136.69h-71.21c2.6-25.26,12.33-46.39,30.51-65.09,13.53,21.65,26.86,42.96,40.7,65.09Z"
      />
      <path
        className="cls-1"
        d="m39.04,71.78c18.84,18.59,29.27,39.41,30.33,64.63H0c13.28-21.98,25.89-42.85,39.04-64.63Z"
      />
    </svg>
  );
}
