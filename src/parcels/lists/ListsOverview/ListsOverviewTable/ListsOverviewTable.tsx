import {Group, Tooltip} from '@mantine/core';
import {IconLabelFilled, IconStar} from '@tabler/icons-react';
import {Link} from '@tanstack/react-router';
import {type ReactElement, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {GourmetTable, type GourmetTableData} from '@/parcels/generic/GourmetTable/GourmetTable.tsx';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {formatRelativeTimestamp} from '@/parcels/lists/ListsOverview/formatRelativeTimestamp.ts';
import {DeleteListButton} from '@/parcels/lists/ListsOverview/ListRenderer/DeleteListButton/DeleteListButton.tsx';
import {EditListButton} from '@/parcels/lists/ListsOverview/ListRenderer/EditListButton/EditListButton.tsx';
import styles from '@/parcels/lists/ListsOverview/ListRenderer/ListElementHeader/ListElementHeader.module.css';
import {VisibilityBadge} from '@/parcels/lists/ListsOverview/ListRenderer/ListElementHeader/ListElementHeader.tsx';
import type {UserList, UserListWithResources} from '@/parcels/lists/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export function ListsOverviewTable({
  tcg,
  isLoading,
  userLists,
  onUpdate,
  onDelete,
}: {
  tcg: Tcg;
  isLoading: boolean;
  userLists: UserListWithResources[];
  onUpdate?: (list: UserList) => void;
  onDelete?: (id: string) => void;
}) {
  const { i18n } = useTranslation();
  const { t } = useTranslation('lists', { keyPrefix: 'table.cols' });
  const { t: t2 } = useTranslation('lists');

  const tableData: GourmetTableData<UserListWithResources> = useMemo(() => {
    const columns = ['name', 'description', 'lastUpdated', 'visibility', 'size', 'color'];
    const colSizes = ['', '', '8', '6', '6', '4'];

    return {
      columns,
      colSizes,
      rows: userLists.map((list) => {
        return {
          entry: list,
          data: {
            name: (
              <Group gap={'0.25rem'}>
                {list.list.systemListType === 'favorites' && <IconStar size={18} color={'var(--gourmet-neutral-9'} />}

                <Link to={'/me/lists/$listId'} params={{ listId: list.list.slug }} className={styles.link}>
                  <GourmetText
                    cgmff={'ui'}
                    cgmc={'neutral-9'}
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textWrap: 'nowrap',
                    }}
                  >
                    {list.list.systemListType && t2(`system.${list.list.name}`)}
                    {!list.list.systemListType && <>{list.list.name}</>}
                  </GourmetText>
                </Link>
              </Group>
            ),
            description: (
              <Tooltip label={list.list.description} openDelay={500}>
                <GourmetText style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {list.list.description}
                </GourmetText>
              </Tooltip>
            ),
            lastUpdated: (
              <GourmetText cgmff={'ui'}>{formatRelativeTimestamp(list.list.updatedAt, i18n.language)}</GourmetText>
            ),
            visibility: <VisibilityBadge visibility={list.list.visibility} />,
            size: <GourmetText cgmff={'ui'}>{list.size}/100</GourmetText>,
            color: (
              <Group>
                {list.list.color && <IconLabelFilled size={20} color={list.list.color ?? 'var(--gourmet-neutral-9)'} />}
              </Group>
            ),
          },
        };
      }),
    };
  }, [userLists, i18n.language, t2]);

  return (
    <GourmetTable
      t={t}
      tcg={tcg}
      isLoading={isLoading}
      tableData={tableData}
      constructHorTableRow={(row) => {
        return (
          <HorTableRow
            key={row.entry.list.id}
            entry={row.entry}
            data={row.data}
            tableData={tableData}
            onCreate={onUpdate}
            onDelete={onDelete}
          />
        );
      }}
      constructVerTableRow={(row) => {
        return (
          <VerTableRow
            key={row.entry.list.id}
            entry={row.entry}
            data={row.data}
            tableData={tableData}
            onCreate={onUpdate}
            onDelete={onDelete}
          />
        );
      }}
    />
  );
}

function HorTableRow({
  entry,
  data,
  tableData,
  onCreate,
  onDelete,
}: {
  entry: UserListWithResources;
  data: Record<string, ReactElement>;
  tableData: GourmetTableData<UserListWithResources>;
  onCreate?: (list: UserList) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <tr key={entry.list.id} data-selected={false} style={{ padding: '0 1rem' }}>
      <td style={{ height: '2.5rem' }}>{''}</td>
      {tableData.columns.map((column) => (
        <td key={column}>{data[column]}</td>
      ))}
      <td>
        <Group wrap={'nowrap'} gap={'0.25rem'} justify={'end'} p={'0 0.25rem 0 0'}>
          <Group gap={'0.25rem'}>
            <EditListButton list={entry.list} onSuccess={onCreate} />
            <DeleteListButton list={entry.list} onSuccess={onDelete} />
          </Group>
        </Group>
      </td>
    </tr>
  );
}

function VerTableRow({
  entry,
  data,
  tableData,
  onCreate,
  onDelete,
}: {
  entry: UserListWithResources;
  data: Record<string, ReactElement>;
  tableData: GourmetTableData<UserListWithResources>;
  onCreate?: (list: UserList) => void;
  onDelete?: (id: string) => void;
}) {
  const { t } = useTranslation('lists', { keyPrefix: 'table.cols' });

  return (
    <>
      {tableData.columns.map((column) => (
        <tr key={`${entry.list.id}_${column}`} data-cell={'not-last'}>
          <th style={{ width: '5.25rem' }}>{t(column)}</th>
          <td data-selected={false}>{data[column]}</td>
        </tr>
      ))}
      <tr key={`tools-1`} data-cell={'last'}>
        <th style={{ width: '5.25rem' }}>
          <GourmetText cgmc={'neutral-5'}>Tools</GourmetText>
        </th>
        <td data-selected={false}>
          <Group wrap={'nowrap'} gap={'0.25rem'} justify={'space-between'} p={'0 0.25rem 0 0'}>
            <Group gap={'0.25rem'}>
              <EditListButton list={entry.list} onSuccess={onCreate} />
              <DeleteListButton list={entry.list} onSuccess={onDelete} />
            </Group>
          </Group>
        </td>
      </tr>
    </>
  );
}
