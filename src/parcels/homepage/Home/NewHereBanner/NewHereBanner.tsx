import { Center, Group, SimpleGrid, Stack, UnstyledButton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCaretDownFilled, IconCaretUpFilled, IconX } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { Activity, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useTcg } from '@/parcels/tcg/TcgProvider.tsx';
import styles from './NewHereBanner.module.css';

export function NewHereBanner({ setNewHere }: { setNewHere: (newHere: boolean) => void }) {
  const { tcg } = useTcg();
  const { t } = useTranslation('home');
  const [opened, setOpened] = useState(false);

  const smallScreen = useMediaQuery('(max-width: 800px)');

  return (
    <Stack className={styles.newHereBanner} gap={'0.25rem'}>
      <Stack p={'0.5rem 1rem'}>
        <Group justify={'space-between'} w={'100%'}>
          <GourmetText cgmc={'neutral-1'} fz={'1.25rem'} fw={'500'} cgmff={'title'}>
            {t('newHere.title')}
          </GourmetText>
          <UnstyledButton onClick={() => setNewHere(false)}>
            <IconX size={18} color={'var(--gourmet-neutral-1'} />
          </UnstyledButton>
        </Group>

        <Stack mr={'1rem'}>
          <GourmetText cgmc={'neutral-1'}>{t('newHere.hook')}</GourmetText>
        </Stack>

        <Activity mode={opened ? 'visible' : 'hidden'}>
          <Stack>
            <SimpleGrid cols={smallScreen ? 1 : 3}>
              <Group wrap={'nowrap'} align={'start'}>
                <GourmetText cgmc={'neutral-1'} className={styles.newHereNumber} fw={500} cgmff={'monospace'}>
                  1
                </GourmetText>
                <GourmetText cgmc={'neutral-1'}>{t('newHere.1')}</GourmetText>
              </Group>

              <Group wrap={'nowrap'} align={'start'}>
                <GourmetText cgmc={'neutral-1'} className={styles.newHereNumber} fw={500} cgmff={'monospace'}>
                  2
                </GourmetText>
                <GourmetText cgmc={'neutral-1'}>
                  <Trans i18nKey="newHere.2" t={t}>
                    Use the
                    <Link
                      to={'/$tcg/advanced'}
                      params={{ tcg: tcg }}
                      style={{ textDecoration: 'underline', color: 'var(--gourmet-neutral-1)' }}
                    >
                      TCG specific search cooker
                    </Link>
                    and construct your query without having to type anything.
                  </Trans>
                </GourmetText>
              </Group>

              <Group wrap={'nowrap'} align={'start'}>
                <GourmetText cgmc={'neutral-1'} className={styles.newHereNumber} fw={500} cgmff={'monospace'}>
                  3
                </GourmetText>
                <GourmetText cgmc={'neutral-1'}>
                  <Trans i18nKey={'newHere.3'} t={t}>
                    Try to use the most basic filters first. Such as <code>name:</code> or <code>text:</code> and build
                    your way from there. For a list of filters, you can go
                    <Link to={'/'} style={{ textDecoration: 'underline', color: 'var(--gourmet-neutral-1)' }}>
                      here
                    </Link>
                    .
                  </Trans>
                </GourmetText>
              </Group>
            </SimpleGrid>

            <GourmetText cgmc={'neutral-1'}>
              <Trans i18nKey={'newHere.footer'} t={t} components={{ br: <br /> }}>
                If you're still unsure, go visit our help page at
                <a
                  href={'https://help.cardgourmet.com'}
                  style={{ textDecoration: 'underline', color: 'var(--gourmet-neutral-1)' }}
                >
                  https://help.cardgourmet.com
                </a>
                For questions and anything else, feel free to contact us via
                <a
                  href={'mailto:help@cardgourmet.com'}
                  style={{ textDecoration: 'underline', color: 'var(--gourmet-neutral-1)' }}
                >
                  email
                </a>
                or on our
                <a
                  href={'https://discord.gg/5KQ6fh3nus'}
                  style={{ textDecoration: 'underline', color: 'var(--gourmet-neutral-1)' }}
                >
                  Discord
                </a>
                .
              </Trans>
            </GourmetText>
          </Stack>
        </Activity>
      </Stack>

      <Stack w={'100%'} className={styles.newHereButton}>
        <UnstyledButton w={'100%'} onClick={() => setOpened(!opened)}>
          <Center>
            {opened && <IconCaretUpFilled color={'color-mix(in srgb, var(--gourmet-orange-1), black 40%)'} />}
            {!opened && <IconCaretDownFilled color={'color-mix(in srgb, var(--gourmet-orange-1), black 40%)'} />}
          </Center>
        </UnstyledButton>
      </Stack>
    </Stack>
  );
}
