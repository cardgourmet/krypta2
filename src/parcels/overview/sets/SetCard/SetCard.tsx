import { IconCalendarWeekFilled, IconCardsFilled } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import { Badge } from '@/parcels/generic/Badge/Badge';
import { Kicker } from '@/parcels/generic/Kicker/Kicker';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import type { DlcDataSet } from '@/parcels/tcg/dlc/api';
import type { MtgDataSet } from '@/parcels/tcg/mtg/api';
import type { PcgDataSet } from '@/parcels/tcg/pcg/api';
import { TcgSetIcon } from '@/parcels/tcg/TcgSetIcon';
import { tcgSetParamsDefaults } from '@/routes/$tcg/sets/$setCode';
import styles from './SetCard.module.css';
import type { SetCardProps } from './types';

export const SetCard = ({ className, set, tcg, ...props }: SetCardProps) => {
  const translation = set.translations.en; // TODO;

  const logo = translation?.imageUrls?.logo;
  const releaseDate = new Date(
    (() => {
      switch (tcg) {
        case 'dlc':
          return (set as DlcDataSet).releaseDate;
        case 'mtg':
          return (set as MtgDataSet).releaseDate;
        case 'pcg':
          return (set as PcgDataSet).releaseStartDate ?? '';
      }
    })(),
  ).toLocaleDateString([], {
    dateStyle: 'medium',
  });

  return (
    <article className={clsx(styles.base, className)} {...props}>
      {logo && (
        <figure aria-hidden className={styles.stage} style={{ '--set-card-logo-src': `url('${logo}')` }}>
          <div className={styles.logoContainer}>
            <img alt="" className={styles.logo} src={logo} />
          </div>
        </figure>
      )}

      <div className={styles.content}>
        <div className={styles.title}>
          <TcgSetIcon tcg={tcg} setCode={set.code ?? '?'} />

          <Typeset
            block
            className={styles.setName}
            size="md"
            style={{ fontFamily: 'var(--cgm-content-font-family)', marginTop: '0.125rem' }}
            weight={600}
          >
            {translation?.name ?? 'Translation not found'}
          </Typeset>

          <Badge size="sm" style={{ marginLeft: 'auto' }}>
            {set.code}
          </Badge>
        </div>

        <Typeset block style={{ marginBottom: '1.25rem' }} variant="secondary">
          {capitalizeFirstLetter(set.type)}
        </Typeset>

        <div className={styles.metadata}>
          <div>
            <Kicker leadingIcon={<IconCardsFilled />} size="sm">
              Prints
            </Kicker>
            <Typeset>{set.printsAvailable}</Typeset>
          </div>
          <div>
            <Kicker leadingIcon={<IconCalendarWeekFilled />} size="sm">
              Released
            </Kicker>
            <Typeset>{releaseDate}</Typeset>
          </div>
        </div>
      </div>

      <Link
        className={styles.link}
        params={{ tcg: tcg, setCode: set.code ?? '?' }}
        to={'/$tcg/sets/$setCode'}
        search={{ ...tcgSetParamsDefaults }}
      />
    </article>
  );
};
