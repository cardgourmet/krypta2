import { createPolymorphicComponent, Text } from '@mantine/core';
import { forwardRef } from 'react';
import type { GourmetTextProps } from '@/parcels/generic/mantine/GourmetTextProps.ts';

export const GourmetText = createPolymorphicComponent<'p', GourmetTextProps>(
  forwardRef<HTMLParagraphElement, GourmetTextProps>((props, ref) => {
    const fontFamily = `var(--cgm-${props.cgmff ?? 'content'}-font-family)`;
    const color = `var(--gourmet-${props.cgmc ?? 'neutral-8'})`;

    return (
      <Text ff={fontFamily} c={color} span={props.span ?? false} ref={ref} {...props}>
        {props.children}
      </Text>
    );
  }),
);
