import { rem } from '@mantine/core';
import type React from 'react';

interface DlcRarityIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export function DlcRaritySuperRare({ size, style, ...others }: DlcRarityIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 144.05 137.61"
      fill="currentColor"
      stroke="currentColor"
      style={{ width: rem(size), height: rem(size), strokeWidth: 0, ...style }}
      {...others}
    >
      <title>dlc-rarity-superrare</title>
      <path
        className="cls-1"
        d="m0,66.24c11.19-10.29,21.99-20.21,33.09-30.41,5.8,6.97,9.36,15.49,12.5,24.24,5.3,14.8,7.9,30.16,9.35,45.75.43,4.59-.99,8.09-6.7,10.04-15.48-15.93-31.22-32.11-48.23-49.62Z"
      />
      <path
        className="cls-1"
        d="m68.51,0v106.48c-2.44.41-4.34.73-6.93,1.17-2.26-27.77-7.74-54.26-24.25-77.73C47.62,20.05,57.81,10.27,68.51,0Z"
      />
      <path
        className="cls-1"
        d="m72.05,137.61c-3.84-4.08-11.64-11.25-17.36-17.34,9.06-10.09,22.26-10.36,34.72.3-6.25,5.11-10.38,11.33-17.36,17.04Z"
      />
      <path
        className="cls-1"
        d="m144.05,66.24c-11.19-10.29-21.99-20.21-33.09-30.41-5.8,6.97-9.36,15.49-12.5,24.24-5.3,14.8-7.9,30.16-9.35,45.75-.43,4.59.99,8.09,6.7,10.04,15.48-15.93,31.22-32.11,48.23-49.62Z"
      />
      <path
        className="cls-1"
        d="m75.54,0c0,35.36,0,70.78,0,106.48,2.44.41,4.34.73,6.93,1.17,2.26-27.77,7.74-54.26,24.25-77.73-10.29-9.87-20.47-19.65-31.18-29.93Z"
      />
    </svg>
  );
}
