import {useMediaQuery} from '@mantine/hooks';
import type {TFunction} from 'i18next';
import {type ReactElement, useMemo} from 'react';
import styles from './GourmetTable.module.css';

type SearchHistoryTableProps<T> = {
  t?: TFunction<string>;
  isLoading: boolean;
  tableData: GourmetTableData<T>;
  constructHorTableRow: (row: GourmetTableDataRow<T>, index: number) => ReactElement;
  constructVerTableRow: (row: GourmetTableDataRow<T>, index: number) => ReactElement;
};

export type GourmetTableDataRow<T> = {
  entry: T;
  data: Record<string, ReactElement>;
};
export type GourmetTableData<T> = {
  columns: string[];
  colSizes?: string[];
  rows: GourmetTableDataRow<T>[];
};

export function GourmetTable<T>({
  t,
  tableData,
  isLoading,
  constructVerTableRow,
  constructHorTableRow,
}: SearchHistoryTableProps<T>) {
  const smallScreen = useMediaQuery('(max-width: 800px)');
  const rowElements = useMemo(() => {
    if (!smallScreen) {
      return tableData?.rows.map((row, index) => {
        return constructHorTableRow(row, index);
      });
    }
    return tableData?.rows.map((row, index) => {
      return constructVerTableRow(row, index);
    });
  }, [constructHorTableRow, constructVerTableRow, smallScreen, tableData?.rows]);

  return (
    <div>
      {!smallScreen && (
        <table className={styles.table} style={{ tableLayout: 'fixed' }}>
          <thead style={{ position: 'sticky', zIndex: 'var(--sticky-layer)' }}>
            <tr>
              <th key={'-1'}>{''}</th>
              {tableData?.columns.map((column, index) => {
                const size = tableData?.colSizes?.[index];
                const sizeRem = size ? (size === 'auto' ? 'auto' : `${size}rem`) : '';

                return (
                  <th key={column + index} style={{ width: sizeRem }}>
                    {t ? t(column) : column}
                  </th>
                );
              })}
              <th key={'-2'} style={{ width: '6rem' }}>
                {''}
              </th>
            </tr>
          </thead>
          <tbody>{!isLoading && (tableData?.rows?.length ?? 0) > 0 && rowElements}</tbody>
        </table>
      )}
      {smallScreen && (
        <table className={styles.table}>
          <tbody>{!isLoading && (tableData?.rows?.length ?? 0) > 0 && rowElements}</tbody>
        </table>
      )}
    </div>
  );
}
