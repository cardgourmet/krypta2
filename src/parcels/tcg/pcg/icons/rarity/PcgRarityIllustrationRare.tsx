import type React from 'react';

interface PcgRarityIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export function PcgRarityIllustrationRare({ size, style, ...others }: PcgRarityIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" {...others}>
      <title>pcg-rarity-illustration-rare</title>
      <defs>
        {/** biome-ignore lint/correctness/useUniqueElementIds: _ */}
        <clipPath id="a" clipPathUnits="userSpaceOnUse">
          <path d="M0 0h612v792H0Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#a)" transform="matrix(2.49294 0 0 -2.49294 -1164.547 368.28)">
        <path
          fill="#fab40a"
          d="M468.699 141.948a.238.238 0 0 0-.232.282l.34 1.721-1.288 1.195a.237.237 0 0 0 .134.408l1.743.21.737 1.592a.237.237 0 0 0 .429 0l.737-1.593 1.743-.209a.235.235 0 0 0 .132-.408l-1.286-1.195.34-1.72a.24.24 0 0 0-.093-.238.24.24 0 0 0-.254-.017l-1.534.856-1.533-.856a.244.244 0 0 0-.115-.028"
        />
        <path
          fill="#fff"
          d="m470.347 147.256.794-1.712 1.872-.225-1.382-1.284.364-1.85-1.648.917-1.648-.918.364 1.851-1.382 1.284 1.872.225zm0 .473a.473.473 0 0 1-.429-.275l-.682-1.472-1.612-.195a.471.471 0 0 1-.265-.815l1.19-1.105-.313-1.592a.468.468 0 0 1 .463-.563c.079 0 .158.019.23.06l1.418.79 1.418-.79a.461.461 0 0 1 .23-.06.468.468 0 0 1 .463.562l-.313 1.593 1.19 1.105a.473.473 0 0 1-.265.815l-1.612.195-.682 1.472a.473.473 0 0 1-.429.275"
        />
      </g>
    </svg>
  );
}
