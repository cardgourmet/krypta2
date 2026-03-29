import {Group, Stack, Tooltip, UnstyledButton} from '@mantine/core';
import {IconAlertTriangleFilled, IconCircleCheckFilled, IconGauge} from '@tabler/icons-react';
import {IconWithOverlayIcon} from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import styles from '@/parcels/lists/ListsOverview/ListRenderer/ListRenderer.module.css';
import type {ResolvedUserListResource} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import type {UserResolvedSavedSearch} from '@/parcels/search/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export function RendererSearchResources({ resources }: { tcg: Tcg; resources: ResolvedUserListResource[] }) {
  return (
    <Stack
      gap={'0.5rem'}
      style={{
        height: '100%',
        width: '100%',
        overflowY: 'hidden',
      }}
    >
      {resources.map((resource) => {
        const search = resource.resourceData as unknown as UserResolvedSavedSearch;

        return (
          <UnstyledButton
            key={resource.listResource.resourceId}
            h={'2rem'}
            w={'100%'}
            className={styles.searchButton}
            onClick={() => {
              // TODO: execute query (maybe we can use Link as well for that)
            }}
          >
            <Group h={'100%'} w={'100%'} justify={'space-between'}>
              <Tooltip label={search.firstSearch.rawQuery} openDelay={1000}>
                <GourmetText
                  cgmff={'monospace'}
                  fz={'0.9rem'}
                  maw={'24rem'}
                  style={{
                    textWrap: 'nowrap',
                    overflowX: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {search.firstSearch.rawQuery}
                </GourmetText>
              </Tooltip>

              <Group h={'100%'} gap={'0.5rem'}>
                <GourmetText cgmff={'ui'}>{search.lastTotalCount} cards</GourmetText>
                <SpeedGauge execTime={search.lastSearch?.executionTime ?? search.firstSearch.executionTime} />
              </Group>
            </Group>
          </UnstyledButton>
        );
      })}
    </Stack>
  );
}

function SpeedGauge({ execTime }: { execTime: number }) {
  let color: string;
  if (execTime <= 100) {
    color = 'var(--gourmet-green-1)';
  } else if (execTime <= 1000) {
    color = 'var(--gourmet-orange-1)';
  } else {
    color = 'var(--gourmet-red-01)';
  }

  return (
    <Tooltip label={`Query took ${execTime}ms server-side`} openDelay={1000}>
      <IconWithOverlayIcon
        icon={<IconGauge color={color} size={20} />}
        overlayIcon={
          <>
            {execTime <= 100 && <IconCircleCheckFilled size={12} color={color} className={styles.speedIcon} />}
            {execTime > 100 && execTime <= 1000 && (
              <IconCircleCheckFilled size={12} color={color} className={styles.speedIcon} />
            )}
            {execTime > 1000 && <IconAlertTriangleFilled size={12} color={color} className={styles.speedIcon} />}
          </>
        }
      />
    </Tooltip>
  );
}
