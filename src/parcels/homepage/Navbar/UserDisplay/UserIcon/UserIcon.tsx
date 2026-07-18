import { Avatar, Style } from '@dicebear/core';
import definition from '@dicebear/styles/glyphs.json';
import { forwardRef, useMemo } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import styles from './UserIcon.module.css';

export const UserIcon = forwardRef<HTMLButtonElement, { onClick?: () => void }>(({ onClick }, ref) => {
  const { user } = useAuth();
  const avatarFallback = useMemo(() => {
    if (!user || user?.avatarUrl) return;

    const style = new Style(definition);
    const avatar = new Avatar(style, {
      seed: user!.id,
    });

    return avatar.toString();
  }, [user]);

  return (
    <>
      {user && (
        <button
          ref={ref}
          type={'button'}
          className={styles.avatarIcon}
          data-unverified={user.state === 'unverified'}
          onClick={onClick}
        >
          {user.avatarUrl && <img src={user.avatarUrl} alt={user.displayName} />}
          {!user.avatarUrl && (
            <img src={`data:image/svg+xml,${encodeURIComponent(avatarFallback ?? '')}`} alt={user.displayName} />
          )}
        </button>
      )}
    </>
  );
});
