import type { Extend, Structure } from '@/parcels/composition/extend';

export type AvatarProps = Extend<Structure, { alt: string; size?: number; src: string }>;
