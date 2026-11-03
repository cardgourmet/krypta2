import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from './WarningBanner.module.css';

export const WarningBanner = ({ usage, max }: { usage: number; max: number }) => {
  const { t } = useTranslation('lists', { keyPrefix: 'overview' });

  return (
    <div className={styles.base}>
      <GourmetText cgmc={'neutral-1'}>{t('limitUsageExceeded', { usage: usage, max: max })}</GourmetText>
    </div>
  );
};
