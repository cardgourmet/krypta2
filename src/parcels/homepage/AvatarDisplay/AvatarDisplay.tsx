import { Avatar, Style } from '@dicebear/core';
import definition from '@dicebear/styles/glyphs.json';
import { useMemo } from 'react';
import type { DataUser } from '@/parcels/user/api.ts';
import styles from './AvatarDisplay.module.css';

export function AvatarDisplay({ author, size }: { author: DataUser; size?: string }) {
  const avatarFallback = useMemo(() => {
    if (!author || author?.avatarUrl) return;

    const style = new Style(definition);
    const avatar = new Avatar(style, {
      seed: author!.id,
    });

    return avatar.toString();
  }, [author]);

  return (
    <div style={{ width: size ?? '2rem', height: size ?? '2rem' }}>
      <div className={styles.userIcon}>
        {author.avatarUrl && <img src={author.avatarUrl ?? ''} alt={author.displayName} />}
        {!author.avatarUrl && (
          <img src={`data:image/svg+xml,${encodeURIComponent(avatarFallback ?? '')}`} alt={author.displayName} />
        )}
      </div>
    </div>
  );
}
