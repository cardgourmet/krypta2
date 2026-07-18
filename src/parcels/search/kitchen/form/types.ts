import type { DlcKitchenFormData } from '@/parcels/tcg/dlc/kitchen/formData.ts';
import type { MtgKitchenFormData } from '@/parcels/tcg/mtg/kitchen/formData.ts';
import type { PcgKitchenFormData } from '@/parcels/tcg/pcg/kitchen/formData.ts';

export type KitchenFormProps<Shape> = {
  k: KitchenPathKey<Shape>;
  title: string;
  description: string;
  filter: string;
};

// this is black magic
type PathKeysWithValueShape<T, Shape> = {
  [K in keyof T]: T[K] extends Shape ? K : never;
}[keyof T];

export type KitchenPathKey<Shape> = PathKeysWithValueShape<
  PcgKitchenFormData & DlcKitchenFormData & MtgKitchenFormData,
  Shape
>;
