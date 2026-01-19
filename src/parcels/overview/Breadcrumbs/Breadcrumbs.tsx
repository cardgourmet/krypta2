import { IconChefHat, IconChevronRight } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './Breadcrumbs.module.css';

export default function Breadcrumbs() {
  const tcg = useTcgByLocation() as Tcg;

  return (
    <div className={styles.breadcrumb}>
      <Link to="/">
        <IconChefHat color="#9ba6b1" size={22} className={styles.homeButton} />
      </Link>
      <IconChevronRight color="#9ba6b1" size={18} />
      <p>
        {tcg === 'dlc' && 'Disney Lorcana'}
        {tcg === 'pcg' && 'Pokémon Card Game'}
        {tcg === 'mtg' && 'Magic: The Gathering'}
      </p>
      <IconChevronRight color="#9ba6b1" size={18} />
      <p>Kartendatenbank</p>
    </div>
  );
}
