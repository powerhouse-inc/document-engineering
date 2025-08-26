import type { ColumnDef, DataType, IndexedData, ObjectSetTableConfig, SortState } from '../table/types.js'

export const sortData = <T extends DataType = DataType>(
  data: Array<IndexedData<T>>,
  sortState: SortState | null,
  columnDef: ColumnDef<T>,
  tableConfig: ObjectSetTableConfig<T>
): Array<IndexedData<T>> => {
  if (sortState === null) {
    return data
  }

  const sortFn = columnDef.rowComparator

  return [...data].sort((rowA, rowB) => {
    const columnValueA = columnDef.valueGetter!(rowA.data, {
      row: rowA.data,
      rowIndex: -1,
      column: columnDef,
      columnIndex: -1,
      tableConfig,
    })
    const columnValueB = columnDef.valueGetter!(rowB.data, {
      row: rowB.data,
      rowIndex: -1,
      column: columnDef,
      columnIndex: -1,
      tableConfig,
    })

    // ensure null values are at the end
    if (columnValueA !== null && columnValueB === null) {
      return -1
    }
    if (columnValueA === null && columnValueB !== null) {
      return 1
    }

    const sortIndex = sortFn!(columnValueA, columnValueB, {
      tableConfig,
      columnDef,
      data: data.map((item) => item.data),
      sortState,
    })

    return sortState.direction === 'asc' ? sortIndex : -sortIndex
  })
}
