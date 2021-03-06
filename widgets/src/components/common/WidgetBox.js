import React, { useState } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import { Paper, Box, Typography, IconButton, Divider } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@material-ui/icons';

const styles = {
  widgetBox: {
    background: '#FEFEFE',
  },
};

const WidgetBox = ({
  title,
  hasDivider,
  classes,
  className,
  children,
  collapsible,
  expanded, // initial state
}) => {
  const [showContent, setShowContent] = useState(expanded);

  const handleExpandClick = () => {
    setShowContent(!showContent);
  };

  let renderedTitle = title;
  if (typeof title === 'string') {
    renderedTitle = <Typography variant="h2">{title}</Typography>;
  }

  return (
    <Paper variant="outlined" square className={classNames(classes.widgetBox, className)}>
      {title && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={`${collapsible ? 8 : 20}px 25px`}
        >
          {renderedTitle}
          <div>
            {collapsible && (
              <IconButton onClick={handleExpandClick}>
                {showContent ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </div>
        </Box>
      )}
      {showContent && (
        <>
          {hasDivider && <Divider />}
          {children && <Box p="20px 25px">{children}</Box>}
        </>
      )}
    </Paper>
  );
};

WidgetBox.propTypes = {
  title: PropTypes.node,
  hasDivider: PropTypes.bool,
  collapsible: PropTypes.bool,
  expanded: PropTypes.bool,

  /** additional styling from parent component on root element */
  className: PropTypes.string,
  /** any node to render inside component */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,

  classes: PropTypes.shape({
    widgetBox: PropTypes.string,
  }).isRequired,
};

WidgetBox.defaultProps = {
  title: null,
  collapsible: false,
  hasDivider: false,
  className: '',
  expanded: true,
};

export default withStyles(styles)(WidgetBox);
