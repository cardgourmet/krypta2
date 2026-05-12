import type { ComponentProps, CSSProperties, ElementType, ReactNode } from 'react';

// biome-ignore lint/complexity/noBannedTypes: this is valid
export type Composable<B, T = {}> =
  | ({
      asChild?: undefined;
    } & Extend<B, T>)
  | ({ asChild: true; children: ReactNode } & T);

/**
 * Constructs a new type with all properties of a base type `B` extended by `T`.
 * @remarks When `B` is a valid HTML element tag name like `'button'` or `'img'` the type will be based on the intrinsic props of that tag.
 */
// biome-ignore lint/complexity/noBannedTypes: this is valid
export type Extend<B, T = {}> = T & Omit<B extends ElementType ? ComponentProps<B> : B, keyof T>;

export type Structure = {
  className?: string;
  id?: string;
  style?: CSSProperties;
};

export type StructureWithChildren = Extend<
  Structure,
  {
    children?: ReactNode;
  }
>;
