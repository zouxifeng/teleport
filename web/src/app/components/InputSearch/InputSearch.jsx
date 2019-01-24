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
import ReactDOM from 'react-dom';
import { debounce } from 'lodash';
import styled from 'styled-components';
import Icon, { Magnifier } from 'shared/components/Icon';

class InputSearch extends React.Component {

  constructor(props) {
    super(props);
    this.debouncedNotify = debounce(() => {
      this.props.onChange(this.state.value);
    }, 200);

    let value = props.value || '';

    this.state = {
      value,
      isFocused: false,
    };
  }

  onBlur = () => {
    this.setState({ isFocused: false });
  }

  onFocus = () => {
    this.setState({ isFocused: true });
  }

  onChange = e => {
    this.setState({ value: e.target.value });
    this.debouncedNotify();
  }

  componentDidMount() {
    // set cursor
    const $el = ReactDOM.findDOMNode(this);

    if ($el) {
      const $input = $el.querySelector('input')
      const length = $input.value.length;
      $input.selectionEnd = length;
      $input.selectionStart = length;
    }
  }

  render() {
    const { autoFocus = false } = this.props;
    const { isFocused } = this.state;
    return (
      <SearchField isFocused={isFocused}>
        <Magnifier fontSize={4} />
        <Input placeholder="SEARCH..."
          autoFocus={autoFocus}
          value={this.state.value}
          onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} />
      </SearchField>
    );
  }
}


function fromTheme(props){
  return {
    background: props.theme.colors.bgSecondary,
    border: 'none',
    borderRadius: 200,
    color: props.theme.colors.light,
    fontSize: props.theme.fontSizes[2],
    height: props.theme.space[5],
    outline: 'none',
    paddingLeft: props.theme.space[5],
    paddingRight: props.theme.space[2],
    '&:focus, &:active': {
      background: props.theme.colors.bgLight,
      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, .24)',
      color: props.theme.colors.link,
    },
    '&::placeholder': {
      color: props.theme.colors.subtle,
      fontSize: props.theme.fontSizes[1],
    }
  }
}

const Input = styled.input`
  ${fromTheme}
`

const SearchField = styled.div`
  position: relative;
  ${Icon} {
    left: ${props => props.theme.space[2]}px;
    opacity: .24;
    position: absolute;
    top: 25%;
    ${props => props.isFocused && {
      color: props.theme.colors.bgSecondary
    }}
  }
`;

export default InputSearch;
