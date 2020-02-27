import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import i18next from 'i18next';

import columnType from 'types/columnType';

const StyledTableCell = withStyles(
  {
    root: {
      background: 'white',
      whiteSpace: 'nowrap',
      padding: '9px 16px 10px',
    },
  },
  { name: 'StyledTableCell' }
)(TableCell);

const InternalTableCell = ({ column, row, showColumnLabel }) => {
  const CustomCell = column.customCell;

  return (
    <StyledTableCell size="small" key={column.accessor} align={column.align} style={column.styles}>
      {CustomCell ? (
        <CustomCell row={row} />
      ) : (
        <>
          {row[column.accessor]}
          {showColumnLabel && (
            <Typography variant="subtitle2">
              {column.header || i18next.t(`poste.companyList.columns.${column.accessor}`)}
            </Typography>
          )}
        </>
      )}
    </StyledTableCell>
  );
};

InternalTableCell.propTypes = {
  column: columnType.isRequired,
  row: PropTypes.shape({}).isRequired,
  showColumnLabel: PropTypes.bool,
};

InternalTableCell.defaultProps = {
  showColumnLabel: false,
};

export default InternalTableCell;
