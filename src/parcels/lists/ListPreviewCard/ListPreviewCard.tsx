import { Divider } from '@mantine/core';
import { IconCalendarTime, IconCards, IconEyeOff, IconSearch } from '@tabler/icons-react';
import clsx from 'clsx';
import { FeaturedIcon } from '@/parcels/generic/FeaturedIcon/FeaturedIcon';
import { Kicker } from '@/parcels/generic/Kicker/Kicker';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import { formatRelativeTimestamp } from '../ListsOverview/formatRelativeTimestamp';
import styles from './ListPreviewCard.module.css';
import type { ListPreviewCardProps } from './types';

export const ListPreviewCard = ({ className, list, resources, size, style }: ListPreviewCardProps) => {
  return (
    <article
      className={clsx(styles.base, className)}
      style={{ '--list-color': list.color ?? 'var(--gourmet-neutral-9)', ...style }}
    >
      <header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <FeaturedIcon
            size="sm"
            style={{ '--cgm-accent': 'var(--list-color)', color: 'contrast-color(var(--cgm-accent))' }}
            variant="primary"
          >
            <IconEyeOff />
          </FeaturedIcon>
        </div>
        <div style={{ marginBlock: '1rem 1.25rem' }}>
          <Typeset
            asChild
            size="md"
            style={{
              fontFamily: 'var(--cgm-content-font-family)',
            }}
            weight={600}
          >
            <h3>{list.name}</h3>
          </Typeset>
          <Typeset variant="tertiary">{list.description}</Typeset>
        </div>

        <div style={{ display: 'grid', gridAutoColumns: '1fr', gridAutoFlow: 'column', width: '100%' }}>
          <div>
            <Kicker size="sm">Ressourcen</Kicker>
            <Typeset>{size}/100</Typeset>
          </div>

          <div>
            <Kicker leadingIcon={<IconCalendarTime />} size="sm">
              Letztes Update
            </Kicker>
            <Typeset>{formatRelativeTimestamp(list.updatedAt, 'de')}</Typeset>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <Kicker leadingIcon={<IconSearch />}>Suchen</Kicker>
        <Divider my="0.25rem" w="100%" />
        <Kicker leadingIcon={<IconCards />}>Karten</Kicker>

        {JSON.stringify(resources?.card?.at(0))}
      </div>
    </article>
  );
};
