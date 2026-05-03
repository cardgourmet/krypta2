import {Group} from '@mantine/core';
import {IconQuestionMark} from '@tabler/icons-react';
import {forwardRef} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import styles from './UserIcon.module.css';

export const UserIcon = forwardRef<HTMLButtonElement, { onClick?: () => void }>(({ onClick }, ref) => {
  const { user } = useAuth();

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
            <Group
              justify={'center'}
              align={'center'}
              style={{
                backgroundColor: 'var(--gourmet-neutral-3)',
                borderRadius: '50%',
                width: '100%',
                height: '100%',
              }}
            >
              <IconQuestionMark color={'var(--gourmet-neutral-8)'} />
            </Group>
          )}
        </button>
      )}
    </>
  );
});
