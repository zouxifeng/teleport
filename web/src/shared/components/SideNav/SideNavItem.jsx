import styled from 'styled-components';
import defaultTheme from './../theme';
import { fontSize, minHeight, space } from 'styled-system'

const values  = {
  fontSize: 1,
  pl: 9,
  pr: 4,
  minHeight: 9,
}

const fromTheme = ({ theme = defaultTheme }) => {
  values.theme = theme;
  return {
    ...fontSize(values),
    ...space(values),
    ...minHeight(values),
    fontWeight: theme.bold,
    background: theme.colors.bgSecondary,
    "&:active, &.active": {
      background: theme.colors.bgTertiary,
      borderLeftColor: theme.colors.accent,
      color: theme.colors.light
    }
  }
}

const SideNavItem = styled.div`
  align-items: center;
  border: none;
  border-left: 4px solid transparent;
  box-sizing: border-box;
  color: rgba(255, 255, 255, .56);
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  outline: none;
  text-decoration: none;
  transition: background .3s, color .3s;
  width: 100%;

  &:hover {
    background: rgba(255, 255, 255, .024);
  }

  ${fromTheme}
`;

SideNavItem.displayName = 'SideNavItem';

export default SideNavItem;
