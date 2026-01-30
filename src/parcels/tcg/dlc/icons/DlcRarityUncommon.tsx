import { rem } from '@mantine/core';
import type React from 'react';

interface DlcRarityIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export function DlcRarityUncommon({ size, style, ...others }: DlcRarityIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 130.93 136.99"
      fill="currentColor"
      stroke="currentColor"
      style={{ width: rem(size), height: rem(size), strokeWidth: 0, ...style }}
      {...others}
    >
      <title>dlc-rarity-uncommon</title>
      <path
        className="cls-1"
        d="m61.42,103.99C45.31,83.43,23.98,71.54.14,63.16V0c20.75,8.17,41.13,16.2,61.27,24.14v79.85Z"
      />
      <path
        className="cls-1"
        d="m70.05,103.93V24.12c19.91-7.86,39.95-15.77,60.69-23.96v62.95c-23.18,8.69-44.83,20.13-60.69,40.82Z"
      />
      <path
        className="cls-1"
        d="m60.94,136.97c-20.74-8.17-40.91-16.11-60.94-24.01v-40.81c28.31,6.38,65.01,34.98,60.94,64.81Z"
      />
      <path
        className="cls-1"
        d="m130.93,70.7v42.52c-19.73,7.77-39.72,15.63-60.38,23.77-1.63-7.83.35-14.33,3.08-20.5,7.24-16.32,20.26-27.09,35.51-35.39,6.65-3.62,13.67-6.55,21.79-10.39Z"
      />
    </svg>
  );
}
