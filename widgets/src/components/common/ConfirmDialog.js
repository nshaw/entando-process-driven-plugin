import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';

const ConfirmDialog = ({ title, message, open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle disableTypography>{title}</DialogTitle>
    <DialogContent>
      {typeof message === 'string' ? <DialogContentText>{message}</DialogContentText> : message}
    </DialogContent>
    <DialogActions>
      <Button variant="outlined" color="default" autoFocus onClick={onClose}>
        Cancel
      </Button>
      <Button variant="contained" color="primary" onClick={onConfirm}>
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmDialog;
