import { Avatar, Style } from '@dicebear/core';
import definition from '@dicebear/styles/waves.json';
import { Group, Progress, Stack } from '@mantine/core';
import { IconDotsVertical, IconLabelFilled } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { VisibilityBadge } from '@/parcels/lists/ListsOverview/ListRenderer/ListElementHeader/ListElementHeader.tsx';
import type { UserList, UserListThumbnail, UserListWithResources } from '@/parcels/lists/types.ts';
import { useUserLimits } from '@/parcels/lists/useInList.tsx';
import { TcgIcon } from '@/parcels/tcg/TcgIcon.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './NewGridListRenderer.module.css';

export function NewGridListRenderer({
  listWithResources,
}: {
  listWithResources: UserListWithResources;
  isLoading: boolean;
  onUpdate?: (list: UserList) => void;
  onDelete?: (id: string) => void;
}) {
  const { t } = useTranslation('lists', { keyPrefix: 'overview' });

  const thumbnail = useMemo(() => {
    const data = listWithResources.list.thumbnailData;
    if (!data) return;

    const thumbnailData = data as UserListThumbnail;
    return thumbnailData.url ?? undefined;
  }, [listWithResources.list.thumbnailData]);

  const thumbnailFallback = useMemo(() => {
    if (thumbnail) return;

    const style = new Style(definition);
    const avatar = new Avatar(style, {
      backgroundColor: [listWithResources.list.color ?? '454f59'],
      seed: listWithResources.list.id ?? undefined,
    });

    return avatar.toString();
  }, [listWithResources.list.id, thumbnail, listWithResources.list.color]);

  const { list, size } = listWithResources;
  const { user } = useAuth();
  const { list_resources_per_list } = useUserLimits(user);

  const progress = ((size ?? 0) / list_resources_per_list) * 100;
  const progressColor = useMemo(() => {
    if (progress >= 90) {
      return 'var(--gourmet-red-01)';
    } else if (progress >= 75) {
      return 'var(--gourmet-orange-1)';
    }
    return 'var(--gourmet-green-1)';
  }, [progress]);

  return (
    <article className={styles.listCard}>
      <div>
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
          }}
        >
          <VisibilityBadge visibility={list.visibility} withoutText />
        </div>

        {thumbnail && (
          <figure
            aria-hidden
            className={styles.thumbnailFigure}
            style={{
              '--thumbnail-fade-color': list.color ? `${list.color}` : 'var(--cgm-background-surface)',
            }}
          >
            <img alt="" className={styles.thumbnailImage} src={`${thumbnail}`} />
          </figure>
        )}
        {!thumbnail && (
          <figure
            aria-hidden
            className={styles.thumbnailFigure}
            style={{
              '--thumbnail-fade-color': list.color ? `${list.color}` : 'var(--cgm-background-surface)',
            }}
          >
            <img
              alt=""
              className={styles.thumbnailImage}
              src={`data:image/svg+xml,${encodeURIComponent(thumbnailFallback ?? '')}`}
            />
          </figure>
        )}
      </div>

      <div className={styles.content}>
        <Stack gap={'0.5rem'} w={'100%'}>
          <Group justify={'space-between'} w={'100%'}>
            <Group gap={'0.5rem'}>
              <GourmetText cgmff={'content'} fz={'1.25rem'} c={'var(--cgm-foreground-primary)'}>
                {list.name}
              </GourmetText>

              <IconLabelFilled size={22} color={list.color ?? 'var(--gourmet-neutral-9'} style={{ flexShrink: 0 }} />
            </Group>

            <ActionButton size={'sm'}>
              <IconDotsVertical />
            </ActionButton>
          </Group>
          {list.description && (
            <GourmetText
              fz={'0.95rem'}
              style={{
                textWrap: 'wrap',
              }}
              cgmc={'neutral-9'}
              mr={'2rem'}
            >
              {list.description}
            </GourmetText>
          )}
          {!list.description && (
            <GourmetText
              fz={'0.95rem'}
              style={{
                textWrap: 'wrap',
              }}
              cgmc={'neutral-4'}
              mr={'2rem'}
            >
              {'No description set'}
            </GourmetText>
          )}

          <Stack h={'100%'} justify={'end'} gap={'0.25rem'}>
            <Group justify={'end'} w={'100%'}>
              <Group gap={'0.25rem'}>
                {(list.allowedTcgs?.length ?? 0) > 0 && (
                  <>
                    <GourmetText cgmff={'ui'} fz={'0.9rem'} cgmc={'neutral-8'}>
                      {t('card.allowed')}
                    </GourmetText>
                    <Group gap={'0.15rem'}>
                      {list.allowedTcgs?.map((tcg) => {
                        return (
                          <TcgIcon
                            key={tcg}
                            tcg={tcg as Tcg}
                            size={17}
                            style={{
                              color: 'var(--gourmet-neutral-8)',
                            }}
                          />
                        );
                      })}
                    </Group>
                  </>
                )}
                {(list.allowedTcgs?.length ?? 0) === 0 && (
                  <GourmetText cgmff={'ui'} fz={'0.9rem'} cgmc={'neutral-8'}>
                    {t('card.allowedAll')}
                  </GourmetText>
                )}
              </Group>
            </Group>

            <div
              style={{
                position: 'relative',
                width: '100%',
              }}
            >
              <Progress size={6} value={progress} color={progressColor} />

              <Group
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'color-mix(in oklab, var(--gourmet-neutral-2), transparent 15%)',
                  padding: '0 0.5rem',
                  borderRadius: '0.5rem',
                }}
                gap={'0.25rem'}
              >
                <GourmetText fz={'0.95rem'} cgmc={'neutral-9'} fw={'bold'}>
                  {`${size ?? 0}`}
                </GourmetText>
                <GourmetText fz={'0.95rem'} cgmc={'neutral-7'}>
                  {`/ ${list_resources_per_list}`}
                </GourmetText>
              </Group>
            </div>
          </Stack>
        </Stack>
      </div>
    </article>
  );
}
