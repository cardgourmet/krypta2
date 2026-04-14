import type {TextProps} from '@mantine/core';
import type {PropsWithChildren} from 'react';

export type GourmetTextProps = PropsWithChildren<TextProps> & {
  cgmc?: GourmetColor;
  cgmff?: GourmetFontFamily;
};

export type GourmetColor =
  | 'neutral-0'
  | 'neutral-1'
  | 'neutral-2'
  | 'neutral-3'
  | 'neutral-4'
  | 'neutral-5'
  | 'neutral-6'
  | 'neutral-7'
  | 'neutral-8'
  | 'neutral-9';

export type GourmetFontFamily = 'content' | 'title' | 'ui' | 'monospace';
