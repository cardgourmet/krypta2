import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { validate as isUUID } from 'uuid';
import z from 'zod';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation';
import type { UserList } from '../../types';
import type { ListPropertiesFormValues } from './types';

const schema = z.looseObject({
  description: z.string().max(1000, 'Die Beschreibung kann nicht länger als 1000 Zeichen sein.'),
  name: z
    .string()
    .nonempty('Dieses Feld ist erforderlich.')
    .max(100, 'Der Name kann nicht länger als 100 Zeichen sein.')
    .refine((value) => !isUUID(value) || 'Der Name darf keine UUID sein.'),
});

export function useListPropertiesForm({ list }: { list?: Partial<UserList> } = {}) {
  return useForm<ListPropertiesFormValues>({
    initialValues: {
      allowedTcgs: (list?.allowedTcgs as Tcg[]) ?? [],
      color: list?.color ?? 'default',
      description: list?.description ?? '',
      name: list?.name ?? '',
      visibility: list?.visibility ?? 'private',
    },
    mode: 'uncontrolled',
    validate: zod4Resolver(schema),
    validateInputOnBlur: true,
  });
}
