import {IconArrowBack, IconArrowDown, IconArrowUp} from '@tabler/icons-react';
import {useTranslation} from "react-i18next";
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import styles from './SearchFooter.module.css';

export default function SearchFooter() {
  const { t } = useTranslation('search');

  return (
    <div className={styles.footer}>
      <div className={styles.controls}>
        <div>
          <GourmetText cgmff={'ui'}>{t('navigate')}</GourmetText>
          <kbd>
            <IconArrowUp size={18} color={'var(--gourmet-neutral-8)'} />
          </kbd>
          <kbd>
            <IconArrowDown size={18} color={'var(--gourmet-neutral-8)'} />
          </kbd>
        </div>
        <div>
          <GourmetText cgmff={'ui'}>{t('start')}</GourmetText>
          <kbd>
            <IconArrowBack size={18} color={'var(--gourmet-neutral-8)'} />
          </kbd>
        </div>
        <div>
          <GourmetText cgmff={'ui'}>{t('close')}</GourmetText>
          <kbd>esc</kbd>
        </div>
      </div>
    </div>
  );
}
