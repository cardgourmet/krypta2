import {Button, Group, Menu, Stack, Tooltip} from '@mantine/core';
import {IconLabelFilled} from '@tabler/icons-react';
import {Link} from '@tanstack/react-router';
import {useMemo} from 'react';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import styles from '@/parcels/search/history/SearchHistoryOverview/SearchHistoryOverview.module.css';

export function ExistsInListsBadge({
  resourceId,
  type,
}: {
  resourceId: string | undefined;
  type: 'card' | 'user_search';
}) {
  const { lists } = useUserLists();
  const existsInLists = useMemo(() => {
    return lists.filter((l) => {
      return l.resources?.[type]?.find((r) => r.listResource.resourceId === resourceId);
    });
  }, [lists, resourceId, type]);
  const firstList = existsInLists?.at(0);

  return (
    <>
      {existsInLists?.length > 0 && (
        <Menu shadow="md" width={250} position={'bottom'} withArrow>
          <Menu.Target>
            <Button className={styles.inListButton}>
              <Group wrap={'nowrap'} gap={'0.2rem'}>
                <IconLabelFilled size={18} color={firstList?.list?.color ?? 'var(--gourmet-neutral-9)'} />
                {existsInLists?.length > 1 && (
                  <GourmetText cgmff={'monospace'} fz={'0.8rem'}>
                    +{existsInLists.length - 1}
                  </GourmetText>
                )}
              </Group>
            </Button>
          </Menu.Target>

          <Menu.Dropdown style={{ zIndex: 0 }}>
            <Stack gap={'0.5rem'} p={'0.25rem'}>
              {existsInLists.map((l) => {
                return (
                  <Link
                    key={l.list.id}
                    to={'/me/lists/$listId'}
                    params={{ listId: l.list.id }}
                    style={{ textDecoration: 'none' }}
                    preload={false}
                  >
                    <Group wrap={'nowrap'} gap={'0.25rem'}>
                      <IconLabelFilled
                        size={18}
                        color={l.list.color ?? 'var(--gourmet-neutral-9)'}
                        style={{ flexShrink: 0 }}
                      />
                      <Tooltip label={l.list.name} openDelay={500}>
                        <GourmetText
                          cgmff={'ui'}
                          fz={'0.9rem'}
                          style={{ textWrap: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                        >
                          {l.list.name}
                        </GourmetText>
                      </Tooltip>
                    </Group>
                  </Link>
                );
              })}
            </Stack>
          </Menu.Dropdown>
        </Menu>
      )}
    </>
  );
}
