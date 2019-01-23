/*
Copyright 2018 Gravitational, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React from 'react';
import styled from 'styled-components';
import { Text, Box } from 'shared/components';
import { width, border, color, space } from 'styled-system';

export const Button = styled.button`
  background: none;
  border-color: ${props => props.theme.colors.terminal};
  box-sizing: border-box;
  cursor: pointer;
  text-transform: uppercase;
  width: 88px;

  &:disabled {
    border: 1px solid ${props => props.theme.colors.subtle};
    color: ${props => props.theme.colors.subtle};
    opacity: .24;
  }

  ${color}
  ${space}
  ${border}
`;

Button.defaultProps = {
  color: 'terminal',
  bg: 'none',
  px: 0,
  py: "4px",
  border: 1,
}

export const Label = styled(Text)`
  display: block;
`

Label.defaultProps = {
  caps: true,
  color: 'terminal',
  mb: 2,
  mt: 2,
}

export const Input = styled.input`
  border: none;
  box-sizing: border-box;
  outline: none;
  width: 360px;
  ${space}
  ${color}
  ${width}
`

Input.defaultProps = {
  bg: 'bgTerminal',
  color: 'terminal',
  mb: 3,
  mr: 2,
  px: 2,
  py: '4px',
}

export const Header = ({children}) => (
  <Text fontSize={0} bold caps mb={3} children={children} />
)

export const Form = styled(Box)`
  font-size: ${props => props.theme.fontSizes[0]}px;
`
Form.defaultProps = {
  color: 'terminal',
  bg: 'dark'
}

