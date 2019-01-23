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

import { sortBy } from 'lodash';
import React from 'react';
import { isMatch } from 'app/lib/objectUtils';
import { TablePaged, Column, Cell, SortHeaderCell, SortTypes } from 'shared/components/DataTable';
import moment from 'moment';
import { SessionIdCell, UsersCell, TypeCell, DateCreatedCell, DescriptionCell } from './SessionListCells';

class SessionList extends React.Component {

  searchableProps = ['nodeDisplayText', 'createdDisplayText', 'sid', 'parties'];

  constructor(props) {
    super(props);

    if (props.storage) {
      this.state = props.storage.findByKey('SessionList')
    }

    if (!this.state) {
      this.state = { colSortDirs: {created: 'ASC'}};
    }
  }

  componentWillUnmount() {
    if (this.props.storage) {
      this.props.storage.save('SessionList', this.state);
    }
  }

  onSortChange = (columnKey, sortDir) => {
    this.state.colSortDirs = { [columnKey]: sortDir };
    this.setState(this.state);
  }

  searchAndFilterCb(targetValue, searchValue, propName){
    if (propName === 'parties') {
      targetValue = targetValue || [];
      return targetValue.join('').toLocaleUpperCase().indexOf(searchValue) !== -1;
    }
  }

  sortAndFilter(data, searchValue){
    const filtered = data.filter(obj=>
      isMatch(obj, searchValue, {
        searchableProps: this.searchableProps,
        cb: this.searchAndFilterCb
      }));

    const columnKey = Object.getOwnPropertyNames(this.state.colSortDirs)[0];
    const sortDir = this.state.colSortDirs[columnKey];
    let sorted = sortBy(filtered, columnKey);
    if(sortDir === SortTypes.ASC){
      sorted = sorted.reverse();
    }

    return sorted;
  }

  render() {
    const { filter, canJoin, searchValue, storedSessions, activeSessions } = this.props;
    const { start, end } = filter;

    let stored = storedSessions.filter(
      item => moment(item.created).isBetween(start, end));

    let active = activeSessions
      .filter( item => item.parties.length > 0)
      .filter( item => moment(item.created).isBetween(start, end));

    stored = this.sortAndFilter(stored, searchValue);
    active = this.sortAndFilter(active, searchValue);

    // always display active sessions first
    const data = [...active, ...stored];
    return (
        <TablePaged rowCount={data.length} data={data} pageSize={50}>
          <Column
            header={<Cell> Type </Cell> }
            cell={<TypeCell /> }
          />
          <Column
            header={<Cell> User / IP Address </Cell> }
            cell={<UsersCell /> }
          />
          <Column
            columnKey="description"
            header={
              <Cell>Description</Cell>
            }
            cell={<DescriptionCell /> }
          />
          <Column
            columnKey="created"
            header={
              <SortHeaderCell
                sortDir={this.state.colSortDirs.created}
                onSortChange={this.onSortChange}
                title="Created (UTC)"
              />
            }
            cell={<DateCreatedCell /> }
          />
          <Column
            header={<Cell> Actions </Cell> }
            cell={
              <SessionIdCell canJoin={canJoin} container={this} />
            }
          />
      </TablePaged>
    )
  }
}

export default SessionList;
