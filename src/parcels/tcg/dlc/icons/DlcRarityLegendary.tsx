import { rem } from '@mantine/core';
import type React from 'react';

interface DlcRarityIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export function DlcRarityLegendary({ size, style, ...others }: DlcRarityIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 147.03 136.99"
      fill="currentColor"
      stroke="currentColor"
      style={{ width: rem(size), height: rem(size), strokeWidth: 0, ...style }}
      {...others}
    >
      <title>dlc-rarity-legendary</title>
      <path
        className="cls-1"
        d="m118.36,136.99H28.81C55.56,94.82,66.2,48.03,73.58,0c8.09,47.79,17.17,94.96,44.77,136.99Z"
      />
      <path
        className="cls-1"
        d="m9.89,82.19C36.06,62.28,54.19,37.01,63.94,5.79c-6.54,42.36-14.72,83.98-38.79,121.75-5.28-15.68-10.13-30.1-15.26-45.35Z"
      />
      <path
        className="cls-1"
        d="m0,50.79c17.5-12.93,34.24-25.29,50.98-37.65-8.05,24.94-23.51,44.27-43.84,61.21-2.51-8.29-4.81-15.87-7.14-23.56Z"
      />
      <path
        className="cls-1"
        d="m137.14,82.19c-26.17-19.91-44.3-45.18-54.05-76.4,6.54,42.36,14.72,83.98,38.79,121.75,5.28-15.68,10.13-30.1,15.26-45.35Z"
      />
      <path
        className="cls-1"
        d="m147.03,50.79c-17.5-12.93-34.24-25.29-50.98-37.65,8.05,24.94,23.51,44.27,43.84,61.21,2.51-8.29,4.81-15.87,7.14-23.56Z"
      />
    </svg>
  );
}
