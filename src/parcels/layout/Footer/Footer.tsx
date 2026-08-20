import {
  IconBrandBluesky,
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandTwitter,
  IconHeartFilled,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.base}>
      <div className={styles.copyrightNotices}>
        <Typeset size="sm" variant="tertiary">
          The literal and graphical information presented on this site about Magic: The Gathering, including card images
          and mana symbols, is copyright Wizards of the Coast, LLC. Cardgourmet is not produced by, endorsed by,
          supported by, or affiliated with Wizards of the Coast.
        </Typeset>
        <Typeset size="sm" variant="tertiary">
          The literal and graphical information presented on this site about the Pokémon Trading Card Game, including
          card text and images, are copyright The Pokémon Company (Pokémon), Nintendo, Game Freak, Creatures, and/or
          Wizards of the Coast. Cardgourmet is not produced by, endorsed by, supported by, or affiliated with The
          Pokémon Company (Pokémon), Nintendo, Game Freak, Creatures, or Wizards of the Coast.
        </Typeset>
        <Typeset size="sm" variant="tertiary">
          The literal and graphical information presented on this site about Yu-Gi-Oh!, including card images, the
          attribute, level/rank and type symbols, is copyright 4K Media Inc, a subsidiary of Konami Digital
          Entertainment, Inc. Cardgourmet is not produced by, endorsed by, supported by, or affiliated with 4K Media or
          Konami Digital Entertainment.
        </Typeset>
        <Typeset size="sm" variant="tertiary">
          The literal and graphical information presented on this site about Disney Lorcana, is copyrighted by Disney
          and Ravensburger. This website uses trademarks and/or copyrights associated with Disney Lorcana TCG, used
          under{' '}
          <a href="https://cdn.ravensburger.com/lorcana/community-code-en">Ravensburger’s Community Code Policy</a>.
          Cardgourmet is not produced by, endorsed by, supported by, or affiliated with Disney or Ravensburger.
        </Typeset>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <Typeset block size="sm" variant="secondary">
            All other content &copy; 2026 Cardgourmet. All rights reserved. Made with{' '}
            <IconHeartFilled
              height="1em"
              style={{ color: 'var(--cgm-color-negative)', verticalAlign: 'sub' }}
              width="1em"
            />{' '}
            by real humans.
          </Typeset>
        </div>

        <div className={styles.links}>
          <Link className={styles.link} to="/privacy-policy">
            Privacy Policy
          </Link>
          <Link className={styles.link} to="/terms-of-use">
            Terms of Use
          </Link>
          <Link className={styles.link} to="/imprint">
            Imprint
          </Link>
        </div>

        <div className={styles.socials}>
          <ActionButton asChild>
            <a href="https://github.com/cardgourmet" rel="noreferrer" target="_blank" title="Github">
              <IconBrandGithub aria-hidden />
            </a>
          </ActionButton>
          <ActionButton asChild>
            <a href="https://discord.gg/5KQ6fh3nus" rel="noreferrer" target="_blank" title="Discord">
              <IconBrandDiscord aria-hidden />
            </a>
          </ActionButton>
          <ActionButton asChild>
            <a href="https://twitter.com/cardgourmet" rel="noreferrer" target="_blank" title="Twitter">
              <IconBrandTwitter aria-hidden />
            </a>
          </ActionButton>
          <ActionButton asChild>
            <a href="https://bsky.app/profile/cardgourmet.com" rel="noreferrer" target="_blank" title="Bluesky">
              <IconBrandBluesky aria-hidden />
            </a>
          </ActionButton>
        </div>
      </div>
    </footer>
  );
};
