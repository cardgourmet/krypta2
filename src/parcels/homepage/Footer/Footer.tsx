import { ActionIcon, Group, Stack } from '@mantine/core';
import { IconBrandBluesky, IconBrandDiscord, IconBrandGithub, IconBrandTwitter } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <Stack className={styles.footer}>
      <GourmetText cgmff={'ui'} fz={'0.85rem'} c={'var(--gourmet-neutral-5'}>
        The literal and graphical information presented on this site about Magic: The Gathering, including card images
        and mana symbols, is copyright Wizards of the Coast, LLC. Cardgourmet is not produced by, endorsed by, supported
        by, or affiliated with Wizards of the Coast.
      </GourmetText>
      <GourmetText cgmff={'ui'} fz={'0.85rem'} c={'var(--gourmet-neutral-5'}>
        The literal and graphical information presented on this site about the Pokémon Trading Card Game, including card
        text and images, are copyright The Pokémon Company (Pokémon), Nintendo, Game Freak, Creatures, and/or Wizards of
        the Coast. Cardgourmet is not produced by, endorsed by, supported by, or affiliated with The Pokémon Company
        (Pokémon), Nintendo, Game Freak, Creatures, or Wizards of the Coast.
      </GourmetText>
      <GourmetText cgmff={'ui'} fz={'0.85rem'} c={'var(--gourmet-neutral-5'}>
        The literal and graphical information presented on this site about Yu-Gi-Oh!, including card images, the
        attribute, level/rank and type symbols, is copyright 4K Media Inc, a subsidiary of Konami Digital Entertainment,
        Inc. Cardgourmet is not produced by, endorsed by, supported by, or affiliated with 4K Media or Konami Digital
        Entertainment.
      </GourmetText>
      <GourmetText cgmff={'ui'} fz={'0.85rem'} c={'var(--gourmet-neutral-5'}>
        The literal and graphical information presented on this site about Disney Lorcana, is copyrighted by Disney and
        Ravensburger. This website uses trademarks and/or copyrights associated with Disney Lorcana TCG, used under{' '}
        <a href="https://cdn.ravensburger.com/lorcana/community-code-en">Ravensburger’s Community Code Policy</a>.
        Cardgourmet is not produced by, endorsed by, supported by, or affiliated with Disney or Ravensburger.
      </GourmetText>

      <div style={{ borderTop: '1px solid var(--gourmet-neutral-3)', margin: '0.25rem 0' }}></div>

      <Group justify={'space-between'}>
        <Stack gap={'0.25rem'}>
          <GourmetText cgmff={'ui'} fz={'0.85rem'} c={'var(--gourmet-neutral-6'}>
            All other content &copy; 2026 Cardgourmet. All rights reserved. Made with ❤ by real humans.
          </GourmetText>
          <Group>
            <Link to={'/privacy-policy'}>
              <GourmetText cgmff={'ui'} fz={'0.85rem'} c={'var(--gourmet-neutral-8'}>
                Privacy Policy
              </GourmetText>
            </Link>
            <Link to={'/terms-of-use'}>
              <GourmetText cgmff={'ui'} fz={'0.85rem'} c={'var(--gourmet-neutral-8'}>
                Terms of Use
              </GourmetText>
            </Link>
            <Link to={'/imprint'}>
              <GourmetText cgmff={'ui'} fz={'0.85rem'} c={'var(--gourmet-neutral-8'}>
                Imprint
              </GourmetText>
            </Link>
          </Group>
        </Stack>
        <Group gap={'0.5rem'}>
          <ActionIcon color="default" component="a" href="https://github.com/cardgourmet" size="xl" variant="subtle">
            <IconBrandGithub size={22} color={'var(--gourmet-neutral-6'} />
          </ActionIcon>

          <ActionIcon color="default" component="a" href="https://discord.gg/5KQ6fh3nus" size="xl" variant="subtle">
            <IconBrandDiscord size={22} color={'var(--gourmet-neutral-6'} />
          </ActionIcon>

          <ActionIcon color="default" component="a" href="https://twitter.com/cardgourmet" size="xl" variant="subtle">
            <IconBrandTwitter size={22} color={'var(--gourmet-neutral-6'} />
          </ActionIcon>

          <ActionIcon
            color="default"
            component="a"
            href="https://bsky.app/profile/cardgourmet.com"
            size="xl"
            variant="subtle"
          >
            <IconBrandBluesky size={22} color={'var(--gourmet-neutral-6'} />
          </ActionIcon>
        </Group>
      </Group>
    </Stack>
  );
}
