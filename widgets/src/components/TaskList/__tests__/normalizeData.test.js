import {
  getType,
  normalizeColumns,
  insertRowControls,
  normalizeRows,
} from 'components/TaskList/normalizeData';
import { compareDates, compareNumbers, compareStrings } from 'components/common/Table/utils';
import ActionCell from 'components/common/Table/custom/ActionCell';
import CheckboxCell from 'components/common/Table/custom/CheckboxCell';
import WIDGET_CONFIGS from 'mocks/app-builder/pages';
import tasks from 'mocks/pda/tasks.json';

const row = {
  name: 'string',
  number: 1,
  date: new Date(),
};

describe('normalizeData', () => {
  it('getType to return the right compare function with string', () => {
    const func = getType('name', row);

    expect(func).toEqual(compareStrings);
  });

  it('getType to return the right compare function with number', () => {
    const func = getType('number', row);

    expect(func).toEqual(compareNumbers);
  });

  it('getType to return the right compare function with date', () => {
    const func = getType('date', row);

    expect(func).toEqual(compareDates);
  });

  it('normalizeColumns to change the columns to fit Table needs', () => {
    const columns = JSON.parse(WIDGET_CONFIGS.TASK_LIST.payload.config.columns);
    const options = JSON.parse(WIDGET_CONFIGS.TASK_LIST.payload.config.options);
    const openDiagram = jest.fn();

    const normalize1 = normalizeColumns(columns, tasks.payload[0]);

    const normalized = insertRowControls(normalize1, options, { openDiagram });

    const expected = columns
      .filter(column => column.isVisible)
      .map(column => ({
        header: column.header,
        accessor: column.name,
        position: column.position,
        sortFunction: getType(column, tasks.payload[0]),
      }));

    // order columns
    expected.sort((a, b) => (a.position > b.position ? 1 : a.position < b.position ? -1 : 0));

    // find required fields according to options
    const requiredFields = options.reduce((obj, option) => {
      obj[option.key] = option.checked;
      return obj;
    }, {});

    expected.unshift({
      header: '_checkbox',
      customCell: CheckboxCell(),
      styles: {
        position: 'sticky',
        left: 0,
        zIndex: 10,
        width: 20,
        borderRight: '1px solid #eee',
        paddingRight: 16,
        textAlign: 'center',
      },
    });

    // add action field
    expected.push({
      header: 'Actions',
      accessor: 'action',
      customCell: ActionCell(requiredFields, openDiagram),
      styles: {
        position: 'sticky',
        right: 0,
        width: 20,
        borderLeft: '1px solid #eee',
        paddingLeft: 16,
        textAlign: 'center',
      },
    });

    expect(JSON.stringify(normalized)).toEqual(JSON.stringify(expected));
  });

  it('normalizeRows to change the columns to fit Table needs', () => {
    const normalized = normalizeRows(tasks.payload);

    const expected = tasks.payload.map(r => {
      const normalizedRow = {};
      Object.keys(r).forEach(key => {
        if (r[key] instanceof Object) {
          normalizedRow[key] = '';
        } else {
          normalizedRow[key] = String(r[key]);
        }
      });
      return normalizedRow;
    });

    expect(normalized).toEqual(expected);
  });
});
