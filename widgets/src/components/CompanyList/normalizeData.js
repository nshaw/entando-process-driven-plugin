import StatusCell from 'components/common/Table/custom/StatusCell';
import { compareDates, compareNumbers, compareStrings } from 'components/common/Table/utils';

export const getType = (column, firstRow) => {
  let sortFunction = compareStrings;
  if (firstRow[column] instanceof Date) {
    sortFunction = compareDates;
  } else if (typeof firstRow[column] === 'number') {
    sortFunction = compareNumbers;
  }

  return sortFunction;
};

export const normalizeColumns = (columns, firstRow) => {
  const normalized = columns
    .filter(column => column.isVisible)
    .map(column => ({
      header: column.header,
      accessor: column.name,
      position: column.position,
      sortFunction: getType(column, firstRow),
    }));
  // order columns
  normalized.sort((a, b) => (a.position > b.position ? 1 : a.position < b.position ? -1 : 0));

  // add action field
  normalized.push({
    header: 'Status',
    accessor: 'status',
    customCell: StatusCell(),
  });

  return normalized;
};

export const normalizeRows = rows =>
  rows.map(row => {
    const normalizedRow = {};
    Object.keys(row).forEach(key => {
      if (row[key] instanceof Object) {
        normalizedRow[key] = '';
      } else {
        normalizedRow[key] = String(row[key]);
      }
    });
    return normalizedRow;
  });

export const normalizeConfigColumns = columns =>
  columns.map((column, i) => ({
    name: column,
    position: i,
    isVisible: true,
  }));

export const normalizeConfigGroups = groups =>
  groups.map(group => ({
    label: group,
    key: group,
    checked: true,
  }));
