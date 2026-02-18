import {Group, Stack, Text, UnstyledButton} from '@mantine/core';
import {IconUser} from '@tabler/icons-react';
import {forwardRef} from 'react';
import styles from './UserDisplayButton.module.css';

export const UserDisplayButton = forwardRef<HTMLButtonElement, { toggle: () => void }>(({ toggle }, ref) => {
  return (
    <UnstyledButton classNames={{ root: styles.userButton }} ref={ref} onClick={toggle}>
      <Group gap={'0.5rem'} p={'0.25rem 0.5rem'} wrap={'nowrap'}>
        <Group
          justify={'center'}
          align={'center'}
          style={{
            backgroundColor: 'var(--gourmet-neutral-4)',
            borderRadius: '50%',
            width: '1.9rem',
            height: '1.9rem',
          }}
        >
          <IconUser size={18} color={'var(--gourmet-neutral-8)'} />
        </Group>
        <Stack gap={'0'} maw={'8rem'} miw={'8rem'}>
          <Text
            ff={'var(--cgm-content-font-family)'}
            fz={'0.9rem'}
            c={'var(--gourmet-neutral-8)'}
            lh={'1.25'}
            style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            Gast
          </Text>
          <Text
            ff={'var(--cgm-content-font-family)'}
            fz={'0.75rem'}
            c={'var(--gourmet-neutral-6)'}
            lh={'1.25'}
            style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            Nicht eingeloggt
          </Text>
        </Stack>
      </Group>
    </UnstyledButton>
  );
});
