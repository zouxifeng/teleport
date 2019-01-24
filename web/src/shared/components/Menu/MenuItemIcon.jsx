import styled from 'styled-components';
import theme from './../theme'
import Icon from 'shared/components/Icon'
import MenuItem from './MenuItem';

const MenuItemIcon =  styled(Icon)`
  ${MenuItem}:hover &,
  ${MenuItem}:focus & {
    color: ${props => props.theme.colors.link};
  }
`;

MenuItemIcon.displayName = 'MenuItemIcon';
MenuItemIcon.defaultProps = {
  fontSize: 3,
  theme: theme,
  mr: 1,
  color: 'text'
}

export default MenuItemIcon;