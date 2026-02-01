import type React from 'react';
import { rem } from '@mantine/core';

interface PcgEnergyIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export function PcgEnergyLightning({ size, style, ...others }: PcgEnergyIconProps) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 595.3 841.9"
      style={{ width: rem(size), height: rem(size), strokeWidth: 0, ...style }}
      {...others}
    >
      <title>pcg-energy-lightning</title>
      <g>
        <path
          className="st0"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#F3E412"
          d="M547.6,420.9c0,138.1-111.9,250-250,250s-250-111.9-250-250s111.9-250,250-250S547.6,282.9,547.6,420.9z"
        />
        <path
          className="st1"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#020203"
          d="M321.6,421.5c0,0.8,0,1.7-0.8,2.5c-14.1,50.4-28.1,100.9-41.3,151.3c-5,16.5-9.1,33.9-14.1,50.4
		c-0.8,1.7,0,2.5,1.7,3.3c1.7,0,1.7-1.7,1.7-2.5C327.4,527.3,385.3,429,444,329.7c0-0.8,0.8-1.7,1.7-2.5
		c-53.7,15.7-107.5,31.4-161.2,47.1c0-0.8,0.8-1.7,0.8-2.5c9.9-31.4,19.8-62,28.9-93.4c6.6-20.7,13.2-42.2,19.8-62.8
		c0-0.8,0.8-1.7,0-2.5c-0.8,0-1.7-0.8-2.5,0c-0.8,0.8-0.8,1.7-1.7,1.7c-33.9,48-68.6,96.7-102.5,144.7
		c-25.6,36.4-51.3,71.9-76.9,108.3c-1.7,1.7-0.8,3.3,0.8,4.1c0.8,0.8,1.7,0,2.5-0.8c30.6-9.1,61.2-19,92.6-28.1
		C272,437.2,296,429.8,321.6,421.5z"
        />
      </g>
    </svg>
  );
}
