import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import i18next from 'i18next';

const StatusButton = withStyles(
  {
    root: {
      borderRadius: 28,
      textTransform: 'uppercase',
      color: 'rgba(0, 0, 0, 0.3)',
      padding: '10px 36px',
      height: 'auto',
      fontSize: 14,
      width: '100%',
      maxWidth: 190,
    },
    contained: {
      '&.approved': {
        backgroundColor: '#b8e986',
      },
      '&.waiting': {
        backgroundColor: '#f0dd00',
      },
      '&.declined': {
        backgroundColor: '#f3a3ad',
      },
    },
  },
  { name: 'StatusButton' }
)(Button);

const StatusCell = () => ({ row }) => (
  <StatusButton variant="contained" className={row.status}>
    {i18next.t(`poste.companyList.statuses.${row.status}`)}
  </StatusButton>
);

export default StatusCell;
