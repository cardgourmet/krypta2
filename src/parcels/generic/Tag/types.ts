import type { Extend, StructureWithChildren } from '@/parcels/composition/extend';

export type TagProps = Extend<StructureWithChildren, { onRemove?: () => void }>;
