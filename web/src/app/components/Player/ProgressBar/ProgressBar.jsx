/*
Copyright 2015 Gravitational, Inc.

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
import Slider from './Slider';
import styled from 'styled-components';
import { Text } from 'shared/components';
import * as Icons from 'shared/components/Icon';
import { fonts } from 'shared/components/theme';

export default class ProgressBar extends React.Component {
  render() {
    const { isPlaying, min, max, value, onChange, onToggle, time } = this.props;
    const Icon = isPlaying ? Icons.CirclePause : Icons.CirclePlay;
    return (
      <StyledProgessBar>
        <ActionButton onClick={onToggle}>
          <Icon />
        </ActionButton>
        <TimeText>{time}</TimeText>
        <SliderContainer>
          <Slider
            min={min}
            max={max}
            value={value}
            onChange={onChange}
            defaultValue={1}
            withBars
            className="grv-slider" />
        </SliderContainer>
      </StyledProgessBar>
    )
  }
}

const SliderContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const TimeText = styled(Text)`
  font-family: ${fonts.mono};
  font-size: ${props => props.theme.fontSizes[1]}px;
  line-height: 24px;
  margin-right: 16px;
  opacity: .56;
`

const ActionButton = styled.button`
  background: ${props => props.theme.colors.dark};
  border: none;
  color: ${props => props.theme.colors.light};
  cursor: pointer;
  font-size: 24px;
  height: 24px;
  margin-right: 16px;
  outline: none;
  opacity: .87;
  padding: 0;
  text-align: center;
  transition: all .3s;
  width: 24px;

  &:hover {
    opacity: 1;

    .icon {
      color: ${props => props.theme.colors.primary};
    }
  }

  .icon {
    height: 24px;
    width: 24px;
  }
`;

const StyledProgessBar = styled.div`
  background-color: ${props => props.theme.colors.dark};
  display: flex;
  color: ${props => props.theme.colors.light};
  padding: 16px;

  .grv-slider {
    display: block;
    padding: 0;
    height: 24px;
  }

  .grv-slider .bar {
    border-radius: 200px;
    height: 8px;
    margin: 8px 0;
  }

  .grv-slider .handle {
    background-color: ${props => props.theme.colors.light};
    border-radius: 200px;
    box-shadow: 0 0 4px rgba(0, 0, 0, .12), 0 4px 4px rgba(0, 0, 0, .24);
    width: 16px;
    height: 16px;
    left: -8px;
    top: 4px;
  }

  .grv-slider .bar-0 {
    background-color: ${props => props.theme.colors.success};
    box-shadow: none;
  }

  .grv-slider .bar-1 {
    background-color: ${props => props.theme.colors.text};
  }
`