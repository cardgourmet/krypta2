import {Group} from '@mantine/core';
import {IconLabelFilled} from '@tabler/icons-react';
import {type ReactElement, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import type {UserListWithResources} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {GourmetTable, type GourmetTableData} from '@/parcels/overview/GourmetTable/GourmetTable.tsx';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export function ListsOverviewTable({
  tcg,
  isLoading,
  userLists,
}: {
  tcg: Tcg;
  isLoading: boolean;
  userLists: UserListWithResources[];
}) {
  const { t } = useTranslation('lists', { keyPrefix: 'table.cols' });

  const tableData: GourmetTableData<UserListWithResources> = useMemo(() => {
    const columns = ['name', 'description', 'lastUpdated', 'visibility', 'size', 'color'];
    const colSizes = ['', '', '10', '6', '6', '4'];

    return {
      columns,
      colSizes,
      rows: userLists.map((list) => {
        return {
          entry: list,
          data: {
            name: <GourmetText>{list.list.name}</GourmetText>,
            description: <GourmetText>{list.list.description}</GourmetText>,
            lastUpdated: <GourmetText cgmff={'ui'}>{list.list.updatedAt}</GourmetText>,
            visibility: <GourmetText cgmff={'ui'}>{list.list.visibility}</GourmetText>,
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
  }, [userLists.map]);

  return (
    <GourmetTable
      t={t}
      tcg={tcg}
      isLoading={isLoading}
      tableData={tableData}
      constructHorTableRow={(row) => {
        return <HorTableRow entry={row.entry} data={row.data} tableData={tableData} />;
      }}
      constructVerTableRow={(row) => {
        return <VerTableRow entry={row.entry} data={row.data} tableData={tableData} />;
      }}
    />
  );
}

function HorTableRow({
  entry,
  data,
  tableData,
}: {
  entry: UserListWithResources;
  data: Record<string, ReactElement>;
  tableData: GourmetTableData<UserListWithResources>;
}) {
  return (
    <tr key={entry.list.id} data-selected={false} style={{ padding: '0 1rem' }}>
      <td style={{ height: '2.5rem' }}>{''}</td>
      {tableData.columns.map((column) => (
        <td key={column}>{data[column]}</td>
      ))}
      <td>
        <Group wrap={'nowrap'} gap={'0.25rem'} justify={'end'} p={'0 0.25rem 0 0'}></Group>
      </td>
    </tr>
  );
}

function VerTableRow({
  entry,
  data,
  tableData,
}: {
  entry: UserListWithResources;
  data: Record<string, ReactElement>;
  tableData: GourmetTableData<UserListWithResources>;
}) {
  return (
    <>
      {tableData.columns.map((column) => (
        <tr key={`${column}`} data-cell={'not-last'}>
          <th style={{ width: '5.25rem' }}>{column}</th>
          <td data-selected={false}>{data[column]}</td>
        </tr>
      ))}
      <tr key={`tools-1`} data-cell={'last'}>
        <th style={{ width: '5.25rem' }}>
          <GourmetText cgmc={'neutral-5'}>Tools</GourmetText>
        </th>
        <td data-selected={false}>
          <Group wrap={'nowrap'} gap={'0.25rem'} justify={'space-between'} p={'0 0.25rem 0 0'}></Group>
        </td>
      </tr>
    </>
  );
}
