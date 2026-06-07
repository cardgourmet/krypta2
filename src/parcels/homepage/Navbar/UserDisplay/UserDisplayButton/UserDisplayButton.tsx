import { Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { IconAlertHexagonFilled, IconUser } from '@tabler/icons-react';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from './UserDisplayButton.module.css';

export const UserDisplayButton = forwardRef<HTMLButtonElement, { toggle: () => void; avatarFallback: string }>(
  ({ toggle, avatarFallback }, ref) => {
    const { t } = useTranslation('nav', { keyPrefix: 'user' });
    const { user } = useAuth();

    return (
      <UnstyledButton classNames={{ root: styles.userButton }} ref={ref} onClick={toggle}>
        <Group gap={'0.5rem'} p={'0.25rem 0.5rem'} wrap={'nowrap'}>
          <Group
            justify={'center'}
            align={'center'}
            style={{
              backgroundColor: 'var(--gourmet-neutral-4)',
              borderRadius: '50%',
              width: '1.9rem',
              height: '1.9rem',
            }}
          >
            {user && (
              <div className={styles.userIcon}>
                {user.avatarUrl && <img src={user.avatarUrl ?? ''} alt={user.displayName} />}
                {!user.avatarUrl && (
                  <img src={`data:image/svg+xml,${encodeURIComponent(avatarFallback)}`} alt={user.displayName} />
                )}
              </div>
            )}
            {!user && <IconUser size={18} color={'var(--gourmet-neutral-8)'} />}
          </Group>
          <Stack gap={'0'} maw={'8rem'} miw={'8rem'}>
            {user && (
              <>
                <GourmetText
                  fz={'0.9rem'}
                  cgmc={'neutral-8'}
                  lh={'1.25'}
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {user.displayName}
                </GourmetText>

                {user.state === 'unverified' && (
                  <Group gap={'0.25rem'}>
                    <IconAlertHexagonFilled size={12} color={'var(--gourmet-orange-1)'} />
                    <GourmetText
                      fz={'0.75rem'}
                      c={'var(--gourmet-orange-1)'}
                      lh={'1.25'}
                      style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      nicht verifiziert
                    </GourmetText>
                  </Group>
                )}
                {user.state === 'verified' && (
                  <GourmetText
                    fz={'0.75rem'}
                    cgmc={'neutral-6'}
                    lh={'1.25'}
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    @{user.username}
                  </GourmetText>
                )}
              </>
            )}
            {!user && (
              <>
                <Text
                  ff={'var(--cgm-content-font-family)'}
                  fz={'0.9rem'}
                  c={'var(--gourmet-neutral-8)'}
                  lh={'1.25'}
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {t('guest')}
                </Text>
                <Text
                  ff={'var(--cgm-content-font-family)'}
                  fz={'0.75rem'}
                  c={'var(--gourmet-neutral-6)'}
                  lh={'1.25'}
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {t('not-logged-in-short')}
                </Text>
              </>
            )}
          </Stack>
        </Group>
      </UnstyledButton>
    );
  },
);
