import styled from 'styled-components';
import theme from './../theme'
import { Icon } from '../Icon'
import SideNavItem from './SideNavItem';

const SideNavItemIcon = styled(Icon)`
  ${SideNavItem}:active &,
  ${SideNavItem}.active & {
    opacity: 1;
  }

  opacity: .56;
`;

SideNavItemIcon.displayName = 'SideNavItemIcon';
SideNavItemIcon.defaultProps = {
  fontSize: 4,
  theme: theme,
  ml: -5,
  mr: 2,
}

export default SideNavItemIcon;




