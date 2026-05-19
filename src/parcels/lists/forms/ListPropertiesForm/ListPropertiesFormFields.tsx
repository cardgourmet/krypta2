import { Group, Stack } from '@mantine/core';
import { IconEyeOff, IconLabelFilled, IconShieldShare, IconWorld } from '@tabler/icons-react';
import { useState } from 'react';
import { Input } from '@/parcels/generic/Input/Input';
import { Select } from '@/parcels/generic/Select/Select';
import { TagSelect } from '@/parcels/generic/TagSelect/TagSelect';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import { ColorSelect } from '../../ListsOverview/ColorSelect/ColorSelect';
import type { ListPropertiesFormFieldsProps } from './types';

export const ListPropertiesFormFields = ({ form, ...props }: ListPropertiesFormFieldsProps) => {
  const [color, setColor] = useState(form.values.color);

  form.watch('color', ({ value }) => setColor(value));

  return (
    <Stack gap="0.75rem" {...props}>
      <Input
        key={form.key('name')}
        label="Name"
        placeholder="e.g. Chef's Recommendations"
        required
        {...form.getInputProps('name')}
      />

      <Input
        key={form.key('description')}
        label="Description"
        placeholder="e.g. Freshly unboxed at the local game store"
        {...form.getInputProps('description')}
      />

      <Select
        data={[
          { label: 'Private', value: 'private' },
          { label: 'Unlisted', value: 'unlisted' },
          { label: 'Public', value: 'public' },
        ]}
        key={form.key('visibility')}
        label="Visibility"
        optionDecorations={{
          private: {
            description: 'Die Liste ist nur für dich sichtbar.',
            icon: <IconEyeOff />,
          },
          unlisted: {
            description: 'Die Liste ist über einen Link sichtbar für alle.',
            icon: <IconShieldShare />,
          },
          public: {
            description: 'Die Liste ist sichtbar für alle.',
            icon: <IconWorld />,
          },
        }}
        {...form.getInputProps('visibility')}
      />

      <TagSelect
        data={[
          { label: 'Disney Lorcana', value: 'dlc' },
          { label: 'Magic: The Gathering', value: 'mtg' },
          { label: 'Pokémon TCG', value: 'pcg' },
        ]}
        hidePickedOptions
        hint="Du kannst beschränken, aus welchen Spielen dieser Liste Karten hinzugefügt werden dürfen."
        key={form.key('allowedTcgs')}
        label="TCGs"
        optionDecorations={{
          dlc: {
            supportingText: 'DLC',
          },
          mtg: {
            supportingText: 'MTG',
          },
          pcg: {
            supportingText: 'PCG',
          },
        }}
        placeholder="Suchen…"
        searchable
        {...form.getInputProps('allowedTcgs')}
      />

      <Stack gap="0.25rem">
        <Typeset size="sm" weight={500}>
          Color
        </Typeset>

        <Group justify="space-between">
          <IconLabelFilled style={{ color: color === 'default' ? 'var(--gourmet-neutral-8)' : color }} />
          <ColorSelect key={form.key('color')} {...form.getInputProps('color')} />
        </Group>
      </Stack>
    </Stack>
  );
};
