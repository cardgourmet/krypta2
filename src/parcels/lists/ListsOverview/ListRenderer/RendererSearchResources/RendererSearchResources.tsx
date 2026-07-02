import { Group, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from '@/parcels/lists/ListsOverview/ListRenderer/GridListRenderer.module.css';
import type { ResolvedUserListResource } from '@/parcels/lists/types.ts';
import type { UserResolvedSavedSearch } from '@/parcels/search/types.ts';
import { tcgSearchParamsDefaults } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function RendererSearchResources({ resources }: { resources: ResolvedUserListResource[] }) {
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
        const searchTcg = resource.listResource.game as Tcg;

        return (
          <Link
            key={resource.listResource.resourceId}
            to={'/$tcg/cards'}
            params={{ tcg: searchTcg }}
            rel="noreferrer noopener"
            search={{
              ...tcgSearchParamsDefaults,
              query: search.firstSearch.rawQuery,
            }}
          >
            <UnstyledButton h={'2rem'} w={'100%'} className={styles.searchButton}>
              <Group h={'100%'} w={'100%'} justify={'space-between'} wrap={'nowrap'}>
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

                <Group h={'100%'} gap={'0.5rem'} wrap={'nowrap'}>
                  <GourmetText cgmff={'ui'} style={{ textWrap: 'nowrap' }}>
                    {search.lastTotalCount} cards
                  </GourmetText>
                </Group>
              </Group>
            </UnstyledButton>
          </Link>
        );
      })}
    </Stack>
  );
}

/*function SpeedGauge({ execTime }: { execTime: number }) {
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
}*/
