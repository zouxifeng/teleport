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
import { Table } from './../Table';
import Icon, { CircleArrowLeft, CircleArrowRight } from 'shared/components/Icon';

class PagedTable extends React.Component {

  onPrev = () => {
    let { startFrom, pageSize } = this.state;

    startFrom = startFrom - pageSize;

    if( startFrom < 0){
      startFrom = 0;
    }

    this.setState({
      startFrom
    })

  }

  onNext = () => {
    const { data=[] } = this.props;
    const { startFrom, pageSize } = this.state;
    let newStartFrom = startFrom + pageSize;

    if( newStartFrom < data.length){
      newStartFrom = startFrom + pageSize;
      this.setState({
        startFrom: newStartFrom
      })
    }
  }

  constructor(props) {
    super(props);
    const { pageSize = 7 } = this.props;
    this.state = {
      startFrom: 0,
      pageSize
    }
  }

  render(){
    const { startFrom, pageSize } = this.state;
    const { data=[] } = this.props;
    const totalRows = data.length;

    let $pager = null;
    let endAt = 0;
    let pagedData = data;

    if (data.length > 0){
      endAt = startFrom + (pageSize > data.length ? data.length : pageSize);

      if(endAt > data.length){
        endAt = data.length;
      }

      pagedData = data.slice(startFrom, endAt);
    }

    const tableProps = {
      ...this.props,
      rowCount: pagedData.length,
      data: pagedData
    }

    const infoProps = {
      pageSize,
      startFrom,
      endAt,
      totalRows
    }

    if(totalRows > pageSize) {
      $pager = <PageInfo {...infoProps} onPrev={this.onPrev} onNext={this.onNext} />;
    }

    return (
      <Table {...tableProps} topbar={$pager} footer={$pager} />
    )
  }
}

const PageInfo = props => {
  const {startFrom, endAt, totalRows, onPrev, onNext, pageSize} = props;
  const shouldBeDisplayed = totalRows > pageSize;

  if(!shouldBeDisplayed){
    return null;
  }

  const isPrevDisabled = startFrom === 0;
  const isNextDisabled = endAt === totalRows;

  return (
    <Pager>
      <h5>
        SHOWING <strong>{startFrom+1}</strong> to <strong>{endAt}</strong> of <strong>{totalRows}</strong>
      </h5>
      <ButtonList>
        <button onClick={onPrev} title="Previous Page" disabled={isPrevDisabled}>
          <CircleArrowLeft fontSize="3" />
        </button>
        <button onClick={onNext} title="Next Page" disabled={isNextDisabled}>
          <CircleArrowRight fontSize="3" />
        </button>
      </ButtonList>
    </Pager>
  )
}

export default PagedTable;

const ButtonList = styled.div`
  margin-left: auto;
`

const Pager = styled.nav`
  display: flex;
  height: 24px;

  h5 {
    font-size: 11px;
    font-weight: 300;
    margin: 0;
    opacity: .87;
  }

  button {
    background: none;
    border: none;
    border-radius: 200px;
    cursor: pointer;
    height: 24px;
    padding: 0;
    margin: 0 2px;
    min-width: 24px;
    outline: none;
    transition: all .3s;

    &:hover {
      background: ${props => props.theme.colors.bgQuaternary };
      ${Icon} {
        opacity: 1;
      }
    }

    ${Icon} {
      opacity: .56;
      transition: all .3s;
    }
  }
`;
