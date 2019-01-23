import styled from 'styled-components'
import { flex, height, alignSelf, justifySelf, space, width, color, textAlign,  } from 'styled-system'
import PropTypes from 'prop-types'
import theme from './../theme'


const Box = styled.div`
  box-sizing: border-box;
  ${space} ${height} ${width} ${color} ${textAlign} ${flex} ${alignSelf} ${justifySelf}
`

Box.displayName = 'Box'

Box.defaultProps = {
  theme: theme
}

const numberStringOrArray = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.string,
  PropTypes.array
])

Box.propTypes = {
  color: PropTypes.string,
  bg: PropTypes.string,
  width: numberStringOrArray,
  w: numberStringOrArray,
  m: numberStringOrArray,
  mt: numberStringOrArray,
  mr: numberStringOrArray,
  mb: numberStringOrArray,
  ml: numberStringOrArray,
  mx: numberStringOrArray,
  my: numberStringOrArray,
  p: numberStringOrArray,
  pt: numberStringOrArray,
  pr: numberStringOrArray,
  pb: numberStringOrArray,
  pl: numberStringOrArray,
  px: numberStringOrArray,
  py: numberStringOrArray,
}

export default Box