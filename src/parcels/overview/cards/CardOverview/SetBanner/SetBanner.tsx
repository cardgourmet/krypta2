import clsx from 'clsx';
import { Badge } from '@/parcels/generic/Badge/Badge';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import { TcgSetIcon } from '@/parcels/tcg/TcgSetIcon';
import { maybe } from '@/utils/maybe';
import styles from './SetBanner.module.css';
import type { SetBannerProps } from './types';

export const SetBanner = ({ className, set, style, tcg, ...props }: SetBannerProps) => {
  const translation = set.translations.en; // TODO;

  const logo = translation?.imageUrls?.logo;

  const content = (
    <div className={styles.content}>
      <div className={styles.title}>
        <TcgSetIcon tcg={tcg} setCode={set.code ?? '?'} />

        <Typeset
          block
          className={styles.setName}
          size="md"
          style={{ fontFamily: 'var(--cgm-content-font-family)' }}
          weight={600}
        >
          {set.translations.en?.name ?? 'Translation not found'}
        </Typeset>

        <Badge size="sm">{set.code}</Badge>
      </div>
    </div>
  );

  return (
    <div
      className={clsx(styles.base, className)}
      style={{
        ...maybe('--set-banner-logo-src', `url('${logo}')`, !!logo),
        ...style,
      }}
      {...props}
    >
      {logo ? (
        <div className={styles.blurContainer}>
          <img alt="" className={styles.logo} src={logo} />

          <div className={styles.contentCutout}>{content}</div>
        </div>
      ) : (
        <div className={styles.contentContainer}>{content}</div>
      )}
    </div>
  );
};
