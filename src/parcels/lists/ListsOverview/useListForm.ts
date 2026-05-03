import {useForm} from '@mantine/form';
import {useEffect} from 'react';
import {validate} from 'uuid';
import type {UserList} from '@/parcels/lists/types.ts';

export function useListForm(props?: { list?: Partial<UserList> }) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: props?.list?.name || '',
      description: props?.list?.description || '',
      visibility: props?.list?.visibility || ('private' as string | undefined),
      allowedTcgs: props?.list?.allowedTcgs || ([] as string[]),
      color: props?.list?.color || (undefined as string | undefined),
    },
    validate: {
      name: (val) => {
        if (val === '') return 'Name cannot be empty';
        if (val.length > 100) return 'Name cannot be longer than 100 characters';
        if (validate(val)) return 'Name cannot be a UUID';
        return null;
      },
      description: (val) => {
        if (val.length > 1000) return 'Description cannot be longer than 1000 characters';
        return null;
      },
    },
  });

  useEffect(() => {
    const values = {
      name: props?.list?.name || '',
      description: props?.list?.description || '',
      visibility: props?.list?.visibility || ('private' as string | undefined),
      allowedTcgs: props?.list?.allowedTcgs || ([] as string[]),
      color: props?.list?.color || (undefined as string | undefined),
    };

    form.setValues(values);
  }, [props?.list, form.setValues]);

  return form;
}
