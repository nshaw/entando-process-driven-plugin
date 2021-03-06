import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  root: {
    width: '100%',
    height: '100%',
    position: 'fixed',
    backgroundColor: 'rgba(0,0,0,.4)',
    top: 0,
    left: 0,
  },
  loader: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
};

const Loader = ({ loading, classes }) =>
  loading && (
    <div className={classes.root}>
      <CircularProgress className={classes.loader} />
    </div>
  );

Loader.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    loader: PropTypes.string,
  }).isRequired,
  loading: PropTypes.bool,
};

Loader.defaultProps = {
  loading: false,
};

export default withStyles(styles)(Loader);
