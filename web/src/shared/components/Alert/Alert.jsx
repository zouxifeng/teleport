import React from 'react';
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { space, color } from 'styled-system'
import defaultTheme from './../theme'

const alertType = props => {
  const { theme, status } = props;
  switch (status) {
    case 'danger':
      return {
        background: theme.colors.error,
      }
    case 'info':
      return {
        background: theme.colors.info,
      }
    case 'warning':
      return {
        background: theme.colors.warning,
      }
    case 'success':
      return {
        background: theme.colors.success,
      }
    default:
      return {
        background: theme.colors.error,
      }
  }
}

const Alert = styled.div`
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 0 0 2px rgba(0, 0, 0, .12),  0 2px 2px rgba(0, 0, 0, .24);
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  margin: 0 0 16px 0;
  min-height: 56px;
  padding: 16px;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  word-break: break-all;
  ${color}
  ${space}
  ${alertType}
`;

const numberStringOrArray = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.string,
  PropTypes.array
]);

Alert.propTypes = {
  status: PropTypes.oneOf(['danger', 'info', 'warning', 'success']),
  m: numberStringOrArray,
  mt: numberStringOrArray,
  mr: numberStringOrArray,
  mb: numberStringOrArray,
  ml: numberStringOrArray,
  mx: numberStringOrArray,
  my: numberStringOrArray
};

Alert.defaultProps = {
  color: 'light',
  status: 'danger',
  theme: defaultTheme,
};

Alert.displayName = 'Alert';

export default Alert;
export const Danger = props => <Alert status="danger" {...props} />
export const Info = props => <Alert status="info" {...props} />
export const Warning = props => <Alert status="warning" {...props} />
export const Success = props => <Alert status="Success" {...props} />