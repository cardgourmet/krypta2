import type { Extend, InputLike, Structure } from '@/parcels/composition/extend';
import type { ListPropertiesFormValues } from '../../forms/ListPropertiesForm/types';

export type ColorSelectProps = Extend<Structure & InputLike<ListPropertiesFormValues['color']>>;
