import { rem } from '@mantine/core';
import type React from 'react';

interface PcgEnergyIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export function PcgEnergyWater({ size, style, ...others }: PcgEnergyIconProps) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="51.5 170.88 500 500.03"
      style={{ width: rem(size), height: rem(size), strokeWidth: 0, ...style }}
      {...others}
    >
      <title>pcg-energy-water</title>
      <g>
        <path
          className="st0"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#248CCC"
          d="M551.5,420.9c0,138.1-111.9,250-250,250s-250-111.9-250-250s111.9-250,250-250S551.5,282.9,551.5,420.9z"
        />
        <path
          className="st1"
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#020203"
          d="M470.4,241.2c-10.7,4.1-20.7,8.3-31.4,12.4c-15.7,5.8-30.6,13.2-43.8,24c-6.6,5.8-13.2,12.4-19,19.8
		c-15.7,21.5-17.4,43.8-6.6,67.8c7.4,15.7,17.4,28.9,28.1,42.2c9.9,12.4,21.5,24,30.6,37.2c12.4,16.5,20.7,34.7,24,55.4
		c3.3,22.3,0,43.8-14.9,62c-9.9,12.4-23.2,19.8-37.2,25.6c-28.1,11.6-57.9,14.9-88.5,12.4c-33.1-3.3-64.5-11.6-94.3-26.5
		c-28.1-14.1-50.4-33.9-67-61.2c-13.2-23.2-19.8-48-17.4-75.2c3.3-46.3,24-83.5,60.4-112.4c28.1-22.3,59.5-38,93.4-49.6
		c38-13.2,76.1-22.3,115.8-28.1c13.2-1.7,27.3-4.1,40.5-5C451.8,241.6,460.7,241.5,470.4,241.2z M318.7,563
		c-4.6,12.5-31.2,14.3-59.5,4c-28.3-10.3-47.6-28.8-43-41.3c4.6-12.5,31.2-14.3,59.5-4C304,532,323.3,550.5,318.7,563z"
        />
      </g>
    </svg>
  );
}
