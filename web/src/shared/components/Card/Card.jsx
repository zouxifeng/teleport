import styled from 'styled-components'
import Box from './../Box'
import theme from './../theme'

const Card = styled(Box)`
  box-shadow: 0 0 32px rgba(0, 0, 0, .12), 0 8px 32px rgba(0, 0, 0, .24);
  border-radius: 12px;
  footer {
    background-color: ${props => props.theme.colors.bgPrimary};
  }
`

Card.defaultProps = {
  theme: theme,
  bg: 'bgSecondary'
}

Card.displayName = 'Card'

export default Card