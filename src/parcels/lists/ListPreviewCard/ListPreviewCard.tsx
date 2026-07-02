import { IconCalendarTime, IconCards, IconEyeOff, IconSearch } from '@tabler/icons-react';
import clsx from 'clsx';
import { BasicCard } from '@/parcels/cards/BasicCard/BasicCard';
import type { AnyPrint } from '@/parcels/cards/types';
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
        <div className={styles.shelf}>
          <div className={styles.shelfLabel}>
            <IconSearch size={18} />
            <Typeset variant="tertiary" weight={600}>
              {resources?.user_search?.length ?? 0}
            </Typeset>
          </div>
        </div>

        <div className={styles.shelf}>
          <div className={styles.shelfLabel}>
            <IconCards size={18} />
            <Typeset variant="tertiary" weight={600}>
              {resources?.card?.length ?? 0}
            </Typeset>
          </div>

          <div className={styles.cardsShelfContent}>
            {resources?.card?.map((card) => (
              <div className={styles.croppedCard} key={card.listResource.resourceId}>
                <BasicCard className={styles.card} print={card.resourceData.print as AnyPrint} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
