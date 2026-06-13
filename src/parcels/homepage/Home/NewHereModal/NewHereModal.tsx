import { Group, Modal, SimpleGrid, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Link } from '@tanstack/react-router';
import { Trans, useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useTcg } from '@/parcels/tcg/TcgProvider.tsx';
import styles from './NewHereModal.module.css';

export function NewHereModal({ opened, setOpened }: { opened: boolean; setOpened: (open: boolean) => void }) {
  const { t } = useTranslation('home');
  const { tcg } = useTcg();

  const smallScreen = useMediaQuery('(max-width: 800px)');

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <GourmetText cgmff={'title'} fw={500} fz={'1.25rem'} c={'var(--gourmet-orange-1)'}>
          New Here?
        </GourmetText>
      }
      size={'xl'}
    >
      <Stack>
        <Stack mr={'1rem'}>
          <GourmetText>{t('newHere.hook')}</GourmetText>
        </Stack>

        <Stack>
          <SimpleGrid cols={smallScreen ? 1 : 3}>
            <Group wrap={'nowrap'} align={'start'}>
              <GourmetText className={styles.newHereNumber} fw={500} cgmff={'monospace'} c={'var(--gourmet-orange-1)'}>
                1
              </GourmetText>
              <GourmetText>{t('newHere.1')}</GourmetText>
            </Group>

            <Group wrap={'nowrap'} align={'start'}>
              <GourmetText className={styles.newHereNumber} fw={500} cgmff={'monospace'} c={'var(--gourmet-orange-1)'}>
                2
              </GourmetText>
              <GourmetText>
                <Trans i18nKey="newHere.2" t={t}>
                  Use the
                  <Link
                    to={'/$tcg/kitchen'}
                    params={{ tcg: tcg }}
                    style={{ textDecoration: 'underline', color: 'var(--gourmet-neutral-7)' }}
                  >
                    TCG specific search cooker
                  </Link>
                  and construct your query without having to type anything.
                </Trans>
              </GourmetText>
            </Group>

            <Group wrap={'nowrap'} align={'start'}>
              <GourmetText className={styles.newHereNumber} fw={500} cgmff={'monospace'} c={'var(--gourmet-orange-1)'}>
                3
              </GourmetText>
              <GourmetText>
                <Trans i18nKey={'newHere.3'} t={t}>
                  Try to use the most basic filters first. Such as <code>name:</code> or <code>text:</code> and build
                  your way from there. For a list of filters, you can go
                  <Link to={'/'} style={{ textDecoration: 'underline', color: 'var(--gourmet-neutral-7)' }}>
                    here
                  </Link>
                  .
                </Trans>
              </GourmetText>
            </Group>
          </SimpleGrid>

          <GourmetText>
            <Trans i18nKey={'newHere.footer'} t={t} components={{ br: <br /> }}>
              For questions and anything else, feel free to contact us via
              <a
                href={'mailto:help@cardgourmet.com'}
                style={{ textDecoration: 'underline', color: 'var(--gourmet-neutral-7)' }}
              >
                email
              </a>
              or on our
              <a
                href={'https://discord.gg/5KQ6fh3nus'}
                style={{ textDecoration: 'underline', color: 'var(--gourmet-neutral-7)' }}
              >
                Discord
              </a>
              .
            </Trans>
          </GourmetText>
        </Stack>
      </Stack>
    </Modal>
  );
}
