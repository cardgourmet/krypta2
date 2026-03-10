import type {ReactElement} from 'react';
import styles from './IconWithOverlayIcon.module.css';

export function IconWithOverlayIcon({ icon, overlayIcon }: { icon: ReactElement; overlayIcon: ReactElement }) {
  return (
    <div
      style={{
        position: 'relative',
        width: 20,
        height: 20,
        display: 'inline-block',
      }}
    >
      {icon}
      <span
        className={styles.overlayIcon}
        /*style={{
          '--bg-color': 'var(--gourmet-neutral-3)',
        }}*/
      >
        {overlayIcon}
      </span>
    </div>
  );
}
