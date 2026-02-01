import { rem } from '@mantine/core';
import type React from 'react';

interface PcgEnergyIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export function PcgEnergyDarkness({ size, style, ...others }: PcgEnergyIconProps) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 595.3 841.9"
      style={{ width: rem(size), height: rem(size), strokeWidth: 0, ...style }}
      {...others}
    >
      <title>pcg-energy-darkness</title>
      <g>
        <path
          className="st0"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#384856"
          d="M547.6,420.9c0,138.1-111.9,250-250,250c-138.1,0-250-111.9-250-250s111.9-250,250-250
		C435.7,170.9,547.6,282.9,547.6,420.9z"
        />
        <path
          className="st1"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#020203"
          d="M244.2,249.5c-0.8-0.8-1.7,0-2.5,0c-13.2,3.3-26.5,7.4-38.9,14.1c-17.4,9.1-33.9,19.8-48,32.2
		c-15.7,14.1-28.9,29.8-38.9,48.8c-15.7,31.4-20.7,64.5-15.7,99.2c5.8,38.9,24.8,70.3,54.6,95.9c16.5,14.1,35.6,25.6,55.4,34.7
		c28.9,13.2,58.7,19.8,91,19c14.1,0,28.1-2.5,42.2-5.8c23.2-5.8,44.6-14.9,66.1-26.5c24-13.2,43.8-30.6,58.7-53.7
		c20.7-30.6,30.6-64.5,28.1-101.7c-0.8-13.2-3.3-26.5-8.3-39.7c-10.7-29.8-28.9-55.4-52.9-76.1c-24-19.8-51.3-33.1-81-41.3
		c-0.8,0-1.7-0.8-2.5,0c0.8,0.8,0.8,1.7,1.7,2.5c9.1,13.2,16.5,27.3,21.5,42.2c5,16.5,5.8,32.2,0,48.8
		c-4.1,12.4-12.4,23.2-22.3,32.2c-19,18.2-42.2,24.8-67.8,21.5c-20.7-3.3-38.9-12.4-52.1-28.1c-15.7-18.2-21.5-39.7-17.4-63.7
		c2.5-17.4,9.9-32.2,20.7-46.3C239.3,255.3,242.6,252.8,244.2,249.5z"
        />
      </g>
    </svg>
  );
}
