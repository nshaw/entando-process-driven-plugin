import PropTypes from 'prop-types';
import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVert from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';

const ITEM_HEIGHT = 40;
const MAX_ITEMS = 5;
const MAX_HEIGHT = ITEM_HEIGHT * MAX_ITEMS;

class IconMenuButton extends React.Component {
  state = {
    anchorEl: null,
    open: false,
  };

  handleClick = e => {
    e.stopPropagation();
    this.setState({ open: true, anchorEl: e.currentTarget });
  };

  handleClose = e => {
    e.stopPropagation();
    this.setState({ open: false });
  };

  render() {
    const { menuItems, id, minMenuWidth } = this.props;
    const { open, anchorEl } = this.state;

    return (
      <>
        <IconButton
          onClick={this.handleClick}
          aria-owns={open ? id : null}
          aria-haspopup="true"
          open={open}
          size="small"
        >
          <MoreVert fontSize="small" />
        </IconButton>
        <Menu
          id={id}
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
          PaperProps={{
            style: {
              maxHeight: MAX_HEIGHT,
              minWidth: minMenuWidth,
            },
          }}
        >
          {menuItems.map(({ onClick, text, icon }) => (
            <MenuItem
              onClick={e => {
                if (onClick) onClick();
                this.handleClose(e);
              }}
              key={text}
              dense
            >
              {icon} {`\u00a0${text}`}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }
}

IconMenuButton.propTypes = {
  id: PropTypes.string,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      onClick: PropTypes.func,
      text: PropTypes.string,
    })
  ),
  minMenuWidth: PropTypes.number,
};

IconMenuButton.defaultProps = {
  id: '',
  menuItems: [],
  minMenuWidth: 0,
};

export default IconMenuButton;
