import { Stack } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { Trans, useTranslation } from 'react-i18next';
import styles from '@/parcels/beta/BetaButton/BetaButton.module.css';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { Modal } from '@/parcels/modals/Modal.tsx';
import type { ExtendModalProps } from '@/parcels/modals/types.ts';

export const BetaModal = ({ ...props }: ExtendModalProps) => {
  const { t } = useTranslation('home', { keyPrefix: 'beta' });

  return (
    <Modal {...props}>
      <Modal.Content>
        <Modal.Title>{t('title')}</Modal.Title>
        <Stack>
          <GourmetText cgmc={'neutral-8'}>{t('head')}</GourmetText>
          <GourmetText cgmc={'neutral-8'}>{t('sub')}</GourmetText>
          <GourmetText cgmc={'neutral-8'}>
            <Trans i18nKey="more" t={t}>
              For more information on our beta, we have a dedicated
              <Link
                to={'/posts/$postId'}
                params={{
                  postId: 'start-of-our-open-beta',
                }}
                className={styles.link}
              >
                blog post
              </Link>
            </Trans>
          </GourmetText>
        </Stack>
      </Modal.Content>
    </Modal>
  );
};
