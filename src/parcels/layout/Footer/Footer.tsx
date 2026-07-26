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
          <Typeset block size="sm" variant="tertiary" weight={500}>
            All other content &copy; 2026 Cardgourmet. All rights reserved.
          </Typeset>
        </div>

        <ul className={styles.links}></ul>
      </div>
    </footer>
  );
};
