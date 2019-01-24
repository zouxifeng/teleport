import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TopNavItem from '../TopNavItem';
import Menu from '../../Menu/Menu';
import defaultAvatar from './avatar.png';

class TopNavUserMenu extends React.Component {

  static displayName = 'TopNavMenu';

  static defaultProps = {
    menuListCss: () => { },
    avatar: defaultAvatar,
    open: false
  }

  static propTypes = {
    /** Callback fired when the component requests to be closed. */
    onClose: PropTypes.func,
    /** Callback fired when the component requests to be open. */
    onShow: PropTypes.func,
    /** If true the menu is visible */
    open: PropTypes.bool,
  }

  setRef = e => {
    this.btnRef = e;
  }

  render() {
    const {
      user,
      onShow,
      onClose,
      open,
      avatar,
      anchorOrigin,
      transformOrigin,
      children,
      menuListCss,
    } = this.props;

    const anchorEl = open ? this.btnRef : null;
    return (
      <React.Fragment>
        <TopNavItem style={{ marginLeft: "auto" }} onClick={onShow}>
          <AvatarButton ref={this.setRef}>
            <em>{user}</em>
            <img src={avatar} />
          </AvatarButton>
        </TopNavItem>
        <Menu
          menuListCss={menuListCss}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={onClose}
        >
          { children }
        </Menu>
      </React.Fragment>
    );
  }
}

export default TopNavUserMenu;

const AvatarButton = styled.div`
  img {
    display: inline-block;
    float: right;
    height: 24px;
    margin: 24px 8px 24px 16px;
  }

  em {
    font-size: 10px;
    font-weight: 800;
    font-style: normal;
    margin: 0;
  }
`;
