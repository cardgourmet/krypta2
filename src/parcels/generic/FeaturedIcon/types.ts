import type { Extend, StructureWithChildren } from '@/parcels/composition/extend';
import type { Accent } from '@/styles/accents';

export type FeaturedIconProps = Extend<
  StructureWithChildren,
  {
    accent?: Accent;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'primary' | 'secondary' | 'outline';
  }
>;
