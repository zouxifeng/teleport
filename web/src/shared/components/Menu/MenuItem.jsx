import defaultTheme, { colors } from './../theme';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import { fontSize, minHeight, color, space } from 'styled-system'

const defVals  = {
  theme: defaultTheme,
  fontSize: 1,
  px: [2, 2],
  minHeight: 5,
  color: colors.text,
  bg: colors.bgLight
}

const fromTheme = props => {
  const values = {
    ...defVals,
    ...props
  }
  return {
    ...fontSize(values),
    ...space(values),
    ...minHeight(values),
    ...color(values),
    fontWeight: values.theme.bold,
    "&:hover, &:focus": {
      background: values.theme.colors.bgSubtle,
      color: values.theme.colors.link
    }
  }
}

const MenuItem = styled.div`
  box-sizing: content-box;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  text-decoration: none;
  white-space: nowrap;
  &:hover,
  &:focus {
    text-decoration: none;
  }

  ${fromTheme}
`

MenuItem.displayName = 'MenuItem';
MenuItem.propTypes = {
  /**
   * Menu item contents.
   */
  children: PropTypes.node,
};

export default MenuItem;