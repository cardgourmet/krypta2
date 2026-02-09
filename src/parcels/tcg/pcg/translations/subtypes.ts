import type {components as c} from '@/schema/api';

export const pcgSubtypesMapping = {
  ex_lower_sv: 'ex (SV)',
  terastal: 'Tera',
} as Record<c['schemas']['PcgDataCard']['subTypes'][number], string>;
