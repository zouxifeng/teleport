import React from 'react'
import { storiesOf } from '@storybook/react'
import Menu from './Menu';
import MenuItem from './MenuItem';
import MenuItemIcon from './MenuItemIcon';
import Button from '../Button';
import Box from '../Box';
import Flex from '../Flex';
import  * as Icons from '../Icon';

storiesOf('Menu', module)
  .add('Menu', () => (
    <Flex justifyContent="space-between">
      <SimpleMenu text="Menu to right">
        <MenuItem>
          Test
        </MenuItem>
        <MenuItem>
          Test2
        </MenuItem>
      </SimpleMenu>
      <SimpleMenu text="Menu in center"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <MenuItem>
          Test
        </MenuItem>
        <MenuItem>
          Test2
        </MenuItem>
        <MenuItem>
          <Button mt={1} mb={1} block> Logout</Button>
        </MenuItem>
      </SimpleMenu>
      <SimpleMenu text="Menu to left"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem>
          Test
        </MenuItem>
        <MenuItem>
          Test2
        </MenuItem>
      </SimpleMenu>
    </Flex>
  ))
.add('MenuItemIcon', () => (
    <Menu
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={true}>
      <MenuItem>
        <MenuItemIcon as={Icons.Apple }/>
        Test
      </MenuItem>
      <MenuItem>
        <MenuItemIcon as={Icons.Cash }/>
        Test
      </MenuItem>
      <MenuItem>
        <MenuItemIcon as={Icons.CircleArrowLeft }/>
        Test
      </MenuItem>
    </Menu>
));

class SimpleMenu extends React.Component {

  state = {
    anchorEl: null,
  };

  handleClickListItem = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuItemClick = () => {
    this.setState({ anchorEl: null });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { text, anchorOrigin, transformOrigin, children } = this.props;
    const { anchorEl } = this.state;
    return (
      <Box m={10} textAlign="center">
        <Button size="small" onClick={this.handleClickListItem}>
          {text}
        </Button>
        <Menu
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          { children }
        </Menu>
      </Box>
    );
  }
}