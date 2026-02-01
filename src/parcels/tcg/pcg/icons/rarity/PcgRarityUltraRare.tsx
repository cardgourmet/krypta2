import type React from 'react';

interface PcgRarityIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export function PcgRarityUltraRare({ size, style, ...others }: PcgRarityIconProps) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 8.4666666 8.4666666"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...others}
    >
      <title>pcg-rarity-ultra-rare</title>
      <g
        style={{
          display: 'inline',
          opacity: 1,
          stroke: '#d50000',
          strokeWidth: '0.699621',
          strokeDasharray: 'none',
          strokeOpacity: 1,
        }}
        transform="matrix(1.0005271,0,0,1.0005561,-0.00261776,-0.00758362)"
      >
        <g
          transform="matrix(1.0064785,0,0,1.0067924,-0.0274279,-0.01227)"
          style={{
            stroke: '#ffffff',
            strokeWidth: '0.695009',
            strokeDasharray: 'none',
            strokeOpacity: 1,
            fill: '#a6a8ab',
            fillOpacity: 1,
          }}
        >
          <path
            style={{
              display: 'inline',
              fill: '#a6a8ab',
              fillOpacity: 1,
              stroke: '#ffffff',
              strokeWidth: '0.695009',
              strokeLinecap: 'square',
              strokeLinejoin: 'round',
              strokeDasharray: 'none',
              strokeOpacity: 1,
              paintOrder: 'stroke markers fill',
            }}
            d="M 2.3077649,1.8064384 1.74236,3.0305932 0.37736502,3.1866567 1.3809673,4.1110324 1.1238091,5.4363716 2.3077649,4.7706148 3.4920636,5.4363716 3.2345626,4.1110324 4.2385077,3.1866567 2.8735127,3.0305932 Z"
          />
          <use
            x="0"
            y="0"
            transform="translate(3.8515658,1.2433929)"
            style={{
              display: 'inline',
              fill: '#a6a8ab',
              fillOpacity: 1,
              stroke: '#ffffff',
              strokeWidth: '0.695009',
              strokeLinecap: 'square',
              strokeLinejoin: 'round',
              strokeDasharray: 'none',
              strokeOpacity: 1,
              paintOrder: 'stroke markers fill',
            }}
          />
        </g>
      </g>
    </svg>
  );
}
