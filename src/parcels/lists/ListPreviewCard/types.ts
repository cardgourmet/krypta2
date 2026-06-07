import type { Extend, Structure } from '@/parcels/composition/extend';
import type { UserListWithResources } from '../types';

export type ListPreviewCardProps = Extend<Structure & UserListWithResources, {}>;
