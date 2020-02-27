import { compareDates, compareNumbers, compareStrings } from 'components/common/Table/utils';
import companies from './company-list.json';

export default function(page, rowsPerPage, sortedColumn, sortOrder = 'asc', filter) {
  let displayRows = companies.payload;
  let size = displayRows.length;
  // apply filter
  if (filter) {
    displayRows = [];
    companies.payload.forEach(row => {
      const keys = Object.keys(row);
      for (let i = 0; i < keys.length; i += 1) {
        if (
          row[keys[i]] !== undefined &&
          row[keys[i]] !== null &&
          row[keys[i]]
            .toString()
            .toUpperCase()
            .includes(filter.toUpperCase())
        ) {
          displayRows.push(row);
          break;
        }
      }
    });
    size = displayRows.length;
  }

  // apply sorting
  let sortFunction = compareStrings;
  if (sortedColumn) {
    if (companies.payload[0][sortedColumn] instanceof Date) {
      sortFunction = compareDates;
    } else if (typeof companies.payload[0][sortedColumn] === 'number') {
      sortFunction = compareNumbers;
    }
  }

  displayRows = sortedColumn
    ? displayRows.sort(sortFunction(sortedColumn, sortOrder))
    : displayRows;

  // get the desired page
  const firstRow = page * rowsPerPage;
  const lastRow = firstRow + rowsPerPage;
  displayRows = Number.isNaN(firstRow) ? displayRows : displayRows.slice(firstRow, lastRow);

  return {
    payload: displayRows,
    metadata: {
      size,
      lastPage: page === Math.floor(companies.payload.length / rowsPerPage) ? 1 : 0,
    },
  };
}
