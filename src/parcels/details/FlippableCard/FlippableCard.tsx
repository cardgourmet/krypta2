import { Image } from '@mantine/core';
import type { RefObject } from 'react';
import styles from './FlippableCard.module.css';

export function FlippableCard(props: {
  frontUrl: string;
  backUrl?: string;
  backupUrl: string;
  flipRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className={styles.card}>
      <div className={styles.flippableContent} ref={props.flipRef}>
        <div>
          <Image src={props.frontUrl} style={{ borderRadius: '14px' }} fallbackSrc={props.backupUrl} />
        </div>
        {props.backUrl && (
          <div style={{ transform: 'rotateY(180deg)', height: '100%' }}>
            <Image src={props.backUrl} style={{ borderRadius: '14px' }} fallbackSrc={props.backupUrl} />
          </div>
        )}
      </div>
    </div>
  );
}
