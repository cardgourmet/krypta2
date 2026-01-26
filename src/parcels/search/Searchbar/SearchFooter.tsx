import { IconArrowBack, IconArrowDown, IconArrowUp } from '@tabler/icons-react';
import styles from './SearchFooter.module.css';

export default function SearchFooter() {
  return (
    <div className={styles.footer}>
      <div className={styles.controls}>
        <div>
          <p>Navigieren</p>
          <kbd>
            <IconArrowUp size={18} color={'var(--gourmet-neutral-8)'} />
          </kbd>
          <kbd>
            <IconArrowDown size={18} color={'var(--gourmet-neutral-8)'} />
          </kbd>
        </div>
        <div>
          <p>Suche starten</p>
          <kbd>
            <IconArrowBack size={18} color={'var(--gourmet-neutral-8)'} />
          </kbd>
        </div>
        <div>
          <p>Schließen</p>
          <kbd>esc</kbd>
        </div>
      </div>
    </div>
  );
}
