import { Center, Group, SimpleGrid, Stack, UnstyledButton } from '@mantine/core';
import { IconCaretDownFilled, IconCaretUpFilled, IconX } from '@tabler/icons-react';
import { Activity, useState } from 'react';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from './NewHereBanner.module.css';

export function NewHereBanner({ setNewHere }: { setNewHere: (newHere: boolean) => void }) {
  const [opened, setOpened] = useState(false);

  return (
    <Stack className={styles.newHereBanner} gap={'0.25rem'}>
      <Stack p={'0.5rem 1rem'}>
        <Group justify={'space-between'} w={'100%'}>
          <GourmetText cgmc={'neutral-1'} fz={'1.25rem'} fw={'500'} cgmff={'title'}>
            New here?
          </GourmetText>
          <UnstyledButton onClick={() => setNewHere(false)}>
            <IconX size={18} color={'var(--gourmet-neutral-1'} />
          </UnstyledButton>
        </Group>

        <Stack mr={'1rem'}>
          <GourmetText cgmc={'neutral-1'}>
            Our search engine is really powerful, but might feel overwhelming. To help you get started, you can do one
            of the following:
          </GourmetText>
        </Stack>

        <Activity mode={opened ? 'visible' : 'hidden'}>
          <Stack>
            <SimpleGrid cols={3}>
              <Group wrap={'nowrap'} align={'start'}>
                <GourmetText cgmc={'neutral-1'} className={styles.newHereNumber} fw={500} cgmff={'monospace'}>
                  1
                </GourmetText>
                <GourmetText cgmc={'neutral-1'}>
                  Just use the search without filters. This will default to searching by card names.
                </GourmetText>
              </Group>

              <Group wrap={'nowrap'} align={'start'}>
                <GourmetText cgmc={'neutral-1'} className={styles.newHereNumber} fw={500} cgmff={'monospace'}>
                  2
                </GourmetText>
                <GourmetText cgmc={'neutral-1'}>
                  Use the TCG specific search builder and construct your query without having to type anything.
                </GourmetText>
              </Group>

              <Group wrap={'nowrap'} align={'start'}>
                <GourmetText cgmc={'neutral-1'} className={styles.newHereNumber} fw={500} cgmff={'monospace'}>
                  3
                </GourmetText>
                <GourmetText cgmc={'neutral-1'}>
                  Try to use the most basic filters first. Such as: `name:` or `text:` and build your way from there.
                  For a list of filters, you can go _here_.
                </GourmetText>
              </Group>
            </SimpleGrid>

            <GourmetText cgmc={'neutral-1'}>
              If you're still unsure, go visit our help page at https://help.cardgourmet.com
              <br />
              For questions and anything else, feel free to contact us via email or on our Discord.
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
