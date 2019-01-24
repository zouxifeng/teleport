import React from 'react'
import { NavLink } from 'react-router-dom';
import cfg from 'app/config';
import { connect } from './../nuclear';
import { getters } from 'app/flux/user';
import { logout } from 'app/flux/user/actions';
import TopNavUserMenu from 'shared/components/TopNav/TopNavUserMenu'
import { TopNav } from 'shared/components';
import MenuItem from 'shared/components/Menu/MenuItem';
import MenuItemIcon from 'shared/components/Menu/MenuItemIcon';
import Button from 'shared/components/Button';
import * as Icons from 'shared/components/Icon';

export class AppBar extends React.Component {

  state = {
    open: false,
  };

  onShowMenu = () => {
    this.setState({ open: true });
  };

  onCloseMenu = () => {
    this.setState({ open: false });
  };

  onItemClick = () => {
    this.onClose();
  }

  onLogout = () => {
    this.props.onLogout();
    this.onClose();
  }

  render() {
    const { username, children, topNavProps } = this.props;
    return (
      <TopNav {...topNavProps}>
        {children}
        <TopNavUserMenu
          menuListCss={menuListCss}
          open={this.state.open}
          onShow={this.onShowMenu}
          onClose={this.onCloseMenu}
          user={username} >
          <MenuItem py={1} as={NavLink} to={cfg.routes.settingsAccount}>
            <MenuItemIcon as={Icons.Profile} />
            Account Settings
          </MenuItem>
          <MenuItem >
            <Button mt={5} mb={2} block onClick={this.onLogout}>
              Sign Out
            </Button>
          </MenuItem>
        </TopNavUserMenu>
      </TopNav>
    )
  }
}

function mapStoreToProps() {
  return {
    username: getters.userName
  }
}

function mapActionsToProps() {
  return {
    onLogout: logout
  }
}

const menuListCss = () => `
  width: 250px;
`

export default connect(mapStoreToProps, mapActionsToProps)(AppBar);