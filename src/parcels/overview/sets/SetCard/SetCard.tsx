import { Avatar, Style } from '@dicebear/core';
import definition from '@dicebear/styles/shapes.json';
import { Group, Stack } from '@mantine/core';
import { IconCalendarWeekFilled, IconCardsFilled } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('sets', { keyPrefix: 'overview' });
  const translation = set.translations.en; // TODO;

  const logo = translation?.imageUrls?.logo;
  const rawReleaseDate = new Date(
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
  );
  const releaseDate = rawReleaseDate.toLocaleDateString([], {
    dateStyle: 'medium',
  });
  const alreadyReleased = rawReleaseDate.getTime() <= Date.now();

  const imageFallback = useMemo(() => {
    if (logo) return;

    const style = new Style(definition);
    const avatar = new Avatar(style, {
      seed: set.code ?? undefined,
    });

    return avatar.toString();
  }, [set.code, logo]);

  return (
    <article className={clsx(styles.base, className)} {...props}>
      {logo && (
        <figure
          aria-hidden
          className={styles.stage}
          style={{
            '--set-card-logo-src': `url('${logo}')`,
            filter: !alreadyReleased ? 'grayscale(1) blur(3px)' : 'none',
          }}
        >
          <div className={styles.logoContainer}>
            <img alt="" className={styles.logo} src={logo} />
          </div>
        </figure>
      )}

      {!logo && (
        <figure
          aria-hidden
          className={styles.stage}
          style={{
            '--set-card-logo-src': `url('data:image/svg+xml,${encodeURIComponent(imageFallback ?? '')}')`,
            filter: !alreadyReleased ? 'grayscale(1) blur(3px)' : 'none',
          }}
        >
          <div className={styles.logoContainer} style={{ backdropFilter: 'blur(0px) saturate(0)' }} />
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
          {alreadyReleased && (
            <>
              <div>
                <Kicker leadingIcon={<IconCardsFilled />} size="sm">
                  {t('card.prints')}
                </Kicker>
                <Typeset>{set.printsAvailable}</Typeset>
              </div>
              <div>
                <Kicker leadingIcon={<IconCalendarWeekFilled />} size="sm">
                  {t('card.released')}
                </Kicker>
                <Typeset>{releaseDate}</Typeset>
              </div>
            </>
          )}
          {!alreadyReleased && (
            <>
              <div>
                <Kicker leadingIcon={<IconCalendarWeekFilled />} size="sm">
                  {t('card.releases')}
                </Kicker>
                <Typeset>{releaseDate}</Typeset>
              </div>
              <Group w={'100%'} justify={'end'}>
                <Stack justify={'end'} h={'100%'}>
                  <Typeset
                    block
                    size="sm"
                    style={{ fontFamily: 'var(--cgm-content-font-family)', color: 'var(--gourmet-orange-1)' }}
                    weight={400}
                  >
                    {t('card.notReleasedYet')}
                  </Typeset>
                </Stack>
              </Group>
            </>
          )}
        </div>
      </div>

      {alreadyReleased && (
        <Link
          className={styles.link}
          params={{ tcg: tcg, setCode: set.code ?? '?' }}
          to={'/$tcg/sets/$setCode'}
          search={{ ...tcgSetParamsDefaults }}
        />
      )}
    </article>
  );
};
