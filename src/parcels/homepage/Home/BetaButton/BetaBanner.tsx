import { Group, Stack, UnstyledButton } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from './BetaBanner.module.css';

export function BetaBanner({ setShow }: { setShow: (show: boolean) => void }) {
  const { t } = useTranslation('home', { keyPrefix: 'beta' });

  return (
    <Stack className={styles.banner} gap={'0.25rem'}>
      <Stack p={'0.5rem 1rem'}>
        <Group justify={'space-between'} w={'100%'}>
          <GourmetText cgmc={'neutral-1'} fz={'1.25rem'} fw={'500'} cgmff={'title'}>
            {t('title')}
          </GourmetText>
          <UnstyledButton onClick={() => setShow(false)}>
            <IconX size={18} color={'var(--gourmet-neutral-1'} />
          </UnstyledButton>
        </Group>

        <Stack>
          <GourmetText cgmc={'neutral-1'}>{t('head')}</GourmetText>
          <GourmetText cgmc={'neutral-1'}>{t('sub')}</GourmetText>
        </Stack>
      </Stack>
    </Stack>
  );
}
