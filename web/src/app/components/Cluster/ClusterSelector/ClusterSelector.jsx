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
import styled from 'styled-components';
import Select from 'react-select';
import * as Icons from 'shared/components/Icon';
import {colors} from 'shared/components/theme';

class ClusterSelector extends React.Component {
  render() {
    const { value, options, onChange } = this.props;
    const selected = options.find(o => o.value === value);
    const title = {label: `${selected.value} Cluster`, value: selected.value};

    return (
      <StyledSelector>
        <Icons.Cluster />
        <Select
          styles={customStyles}
          value={title}
          onChange={onChange}
          options={options}
        />
      </StyledSelector>
    );
  }
}

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? colors.light : colors.text,
  }),

  input: (provided) => ({
    ...provided,
    border: 'none',
    color: 'rgba(255, 255, 255, .87)',
    margin: 0,
    padding: 0,
    width: '100%',
  }),

  noOptionsMessage: (provided) => ({
    ...provided,
    color: 'blue',
    margin: 0,
    padding: 0,
    width: '100%',
  }),

  menu: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    border: 'none',
    margin: 0,
    padding: 0,
    width: '100%',
  }),

  dropdownIndicator: () => ({
    border: 'none',
    height: '24px',
    margin: '0',
    opacity: .24,
    width: '24px',
  }),

  valueContainer: () => ({
    border: 'none',
    color: 'rgba(255, 255, 255, .87)',
    width: '100%',
  }),


  container: (provided) => ({
    ...provided,
    border: 'none',
    color: 'rgba(255, 255, 255, .87)',
    height: '24px',
    marginBottom: '8px',
    padding: '0',
    width: '200px',
  }),

  indicatorsContainer: (provided) => ({
    ...provided,
    border: 'none',
    color: 'rgba(255, 255, 255, .87)',
    height: '24px',
    padding: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  }),

  indicatorSeparator: () => ({
    display: 'none'
  }),

  control: (provided) => ({
    ...provided,
    border: 'none',
    background: 'none',
    color: 'rgba(255, 255, 255, .87)',
    height: '24px',
    lineHeight: '24px',
    minHeight: 'auto',
    width: '100%',
    padding: '0 24px 0 0',
  }),

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return {
      ...provided,
      border: 'none',
      color: 'rgba(255, 255, 255, .87)',
      fontSize: '14px',
      opacity,
      transition
    };
  }
}


const StyledSelector = styled.div`
  display: inline-bock;
  padding-left: 24px;
  position: relative;

  .icon {
    opacity: .56;
    position: absolute;
    top: 3px;
    left: 0;
  }
`

export default ClusterSelector;