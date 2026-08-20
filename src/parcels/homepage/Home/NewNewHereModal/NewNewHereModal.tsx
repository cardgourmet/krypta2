import { Group, Stack } from '@mantine/core';
import { IconQuestionMark } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import type { Ref } from 'react';
import catgourmetImage from '@/assets/catgourmet_neutral_happy.png';
import { FeaturedIcon } from '@/parcels/generic/FeaturedIcon/FeaturedIcon';
import { Tag } from '@/parcels/generic/Tag/Tag';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import { Modal } from '@/parcels/modals/Modal';
import type { ExtendModalProps } from '@/parcels/modals/types';
import { useTcg } from '@/parcels/tcg/TcgProvider';
import styles from './NewNewHereModal.module.css';

export const NewNewHereModal = ({
  innerProps: { ref },
  ...props
}: ExtendModalProps<{ ref: Ref<HTMLDivElement | null> }>) => {
  const { tcg } = useTcg();

  return (
    <Modal {...props} ref={ref}>
      <Modal.Content>
        <Stack gap="1rem">
          <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
            <FeaturedIcon size="lg" variant="secondary">
              <IconQuestionMark />
            </FeaturedIcon>

            <Modal.Title>Need help?</Modal.Title>
          </div>

          <Group align="center" className={styles.message} gap="0.75rem" wrap="nowrap">
            <img
              alt="The Catgourmet, a cat with a big mustache and a chefs hat holding some playing cards with one of it's paws."
              src={catgourmetImage}
              width={64}
            />

            <div>
              <Typeset block style={{ marginBottom: '0.375rem' }}>
                Hi, I'm <b>Gourmet</b> the cat! <span aria-hidden>₍^. .^₎⟆</span>
              </Typeset>
              <Typeset variant="secondary">
                We know our search engine can be overwhelming, but it's really powerful.
              </Typeset>
            </div>
          </Group>

          <Typeset block style={{ textAlign: 'center' }}>
            To help you get started, you can do one of the following:
          </Typeset>

          <ol className={styles.tips}>
            <li>
              <span>
                Just use the search without filters. Queries without any filter return results based on the card's name.
              </span>
            </li>
            <li>
              <span>
                Use the{' '}
                <Link params={{ tcg }} to={'/$tcg/kitchen'}>
                  TCG-specific search kitchen
                </Link>{' '}
                and construct your query without having to type anything.
              </span>
            </li>
            <li>
              <span>
                Experiment with basic filters like <Tag style={{ display: 'inline-flex' }}>text:</Tag> or{' '}
                <Tag style={{ display: 'inline-flex' }}>type:</Tag> to get comfortable with our syntax and explore all
                our supported filters once you've got the hang of it.
              </span>
            </li>
          </ol>

          <Typeset variant="secondary">
            If you encounter any issues, have a question or something else you want us to know about, feel free to reach
            out to us via <a href="mailto:help@cardgourmet.com">email</a> or the{' '}
            <a href="https://discord.gg/5KQ6fh3nus" rel="noreferrer" target="_blank">
              Cardgourmet Discord
            </a>
            .
          </Typeset>
        </Stack>
      </Modal.Content>
    </Modal>
  );
};
