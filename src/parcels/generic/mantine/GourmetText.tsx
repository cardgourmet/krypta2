import {Text} from '@mantine/core';
import type {GourmetTextProps} from '@/parcels/generic/mantine/GourmetTextProps.ts';

export function GourmetText(props: GourmetTextProps) {
  const fontFamily = `var(--cgm-${props.cgmff ?? 'content'}-font-family)`;
  const color = `var(--gourmet-${props.cgmc ?? 'neutral-8'})`;

  return (
    <Text ff={fontFamily} c={color} span={props.span ?? false} {...props}>
      {props.children}
    </Text>
  );
}
