import { Modal, Stack, UnstyledButton } from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import type { GourmetTextProps } from '@/parcels/generic/mantine/GourmetTextProps.ts';
import styles from '@/parcels/homepage/Home/Home.module.css';

export function BetaButton({ style, ...others }: GourmetTextProps) {
  const { t } = useTranslation('home', { keyPrefix: 'beta' });

  const [opened, setOpened] = useState(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <GourmetText cgmff={'title'} fw={500} fz={'1.25rem'} c={'var(--gourmet-purple-1)'}>
            {t('title')}
          </GourmetText>
        }
        size={'xl'}
      >
        <Stack>
          <GourmetText cgmc={'neutral-8'}>{t('head')}</GourmetText>
          <GourmetText cgmc={'neutral-8'}>{t('sub')}</GourmetText>
        </Stack>
      </Modal>

      <UnstyledButton
        onClick={() => {
          setOpened(true);
        }}
        style={style}
      >
        <GourmetText
          style={{
            textTransform: 'uppercase',
          }}
          cgmff={'ui'}
          className={styles.rainbowText}
          fw={600}
          {...others}
        >
          Beta
        </GourmetText>
      </UnstyledButton>
    </>
  );
}
