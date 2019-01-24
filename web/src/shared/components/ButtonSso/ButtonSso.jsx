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
import styled from 'styled-components'
import Button from '../Button';
import * as Icons from '../Icon/Icon';
import { fade } from '../utils/colorManipulator';

const TypeEnum = {
  MICROSOFT: 'microsoft',
  GITHUB: 'github',
  BITBUCKET: 'bitbucket',
  GOOGLE: 'google',
};

const ButtonSso = props => {
  const { type, ...rest } = props;
  const { color, Icon } = pickSso(type);
  return (
    <StyledButton color={color} block {...rest}>
      {Boolean(Icon) && (
        <IconBox>
          <Icon />
        </IconBox>
      )}
      {props.children}
    </StyledButton>
  )
}

function pickSso(type) {
  switch (type) {
    case TypeEnum.MICROSOFT:
      return { color: '#2672ec', Icon: Icons.Windows };
    case TypeEnum.GITHUB:
      return { color: '#444444', Icon: Icons.Github };
    case TypeEnum.BITBUCKET:
      return { color: '#205081', Icon: Icons.BitBucket };
    case TypeEnum.GOOGLE:
      return { color: '#dd4b39', Icon: Icons.Google };
    default:
      return { color: '#f7931e', Icon: Icons.OpenID };
  }
}

const StyledButton = styled(Button)`
  background-color: ${ props => props.color};

  &:hover, &:focus {
    background: ${ props => fade(props.color, 0.4 ) };
  }
  height: 48px;
  line-height: 48px;
  position: relative;
  box-sizing: border-box;

`

const IconBox = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 56px;
  font-size: 24px;
  text-align: center;
  border-right: 1px solid rgba(0,0,0,.2);
`

export default ButtonSso;
export {
  TypeEnum
}