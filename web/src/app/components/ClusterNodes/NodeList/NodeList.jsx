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
import { NavLink } from 'react-router-dom';
import { sortBy } from 'lodash';
import { isMatch } from 'app/lib/objectUtils';
import { TablePaged, Column, Cell, TextCell, SortHeaderCell, SortTypes, EmptyIndicator } from 'shared/components/DataTable';
import * as Icons from 'shared/components/Icon';
import cfg from 'app/config';
import history from 'app/services/history';

const EmptyValue = ({ text='Empty' }) => (
  <small>
    <span>{text}</span>
  </small>
);

const TagCell = ({rowIndex, data, ...props}) => {
  const { tags } = data[rowIndex];
  let $content = tags.map((item, index) => (
    <StyledTag key={index} title={`${item.name}:${item.value}`}>
      {item.name}: {item.value}
    </StyledTag>
  ));

  if ($content.length === 0) {
    $content = <EmptyValue text="No assigned labels"/>;
  }

  return (
    <Cell {...props}>
      {$content}
    </Cell>
  )
}


class LoginCell extends React.Component {
  state = {
    dropdownOpen: false
  };

  onKeyPress = e => {
    if (e.key === 'Enter' && e.target.value) {
      const url = this.makeUrl(e.target.value);
      history.push(url);
    }
  }

  onShowLoginsClick = () => {
    this.setState({dropdownOpen: !this.state.dropdownOpen});
    // this.refs.customLogin.focus();
  }

  makeUrl(login) {
    const { data, rowIndex } = this.props;
    const { siteId, id } = data[rowIndex];
    const onLogin = login || function() {};

    return cfg.getTerminalLoginUrl({
      siteId: siteId,
      serverId: id,
      login: onLogin
    });
  }

  renderLoginButton() {

  }

  renderEmptyMessage() {

  }

  render() {
    const { logins, ...props } = this.props;
    const $lis = [];
    const defaultLogin = logins[0] || '';
    const defaultTermUrl = this.makeUrl(defaultLogin);
    let dropdown = null;

    for (var i = 0; i < logins.length; i++) {
      const termUrl = this.makeUrl(logins[i]);
      $lis.push(
        <li key={i}>
          <NavLink to={termUrl}>
            {logins[i]}
          </NavLink>
        </li>
      );
    }

    if(this.state.dropdownOpen) {
      dropdown = (
        <ul>
          <li>
            <input ref="customLogin"
              placeholder="Enter login name..."
              onKeyPress={this.onKeyPress}
              />
          </li>
          {$lis}
        </ul>
      );
    }

    return (
      <Cell {...props}>
        <div>
          {logins.length === 0 &&
            <EmptyValue text="No assigned logins"/>
          }
          {logins.length > 0 &&
            <StyledSession>
              <NavLink to={defaultTermUrl}>
                <Icons.Cli/>
                <strong>{defaultLogin}</strong>
              </NavLink>

              <button onClick={this.onShowLoginsClick} >
                <Icons.CarrotDown/>
              </button>

              {dropdown}
            </StyledSession>
          }
        </div>
      </Cell>
    )
  }
}

class NodeList extends React.Component {
  storageKey = 'NodeList';
  searchableProps = ['addr', 'hostname', 'tags'];

  constructor(props) {
    super(props);
    if (props.storage) {
      this.state = props.storage.findByKey(this.storageKey);
    }

    if (!this.state) {
      this.state = { colSortDirs: { hostname: SortTypes.DESC } };
    }
  }

  componentWillUnmount() {
    if (this.props.storage) {
      this.props.storage.save(this.storageKey, this.state);
    }
  }

  onSortChange = (columnKey, sortDir) => {
    this.state.colSortDirs = { [columnKey]: sortDir };
    this.setState(this.state);
  }

  onSshInputEnter = (login, host) => {
    const url = cfg.getTerminalLoginUrl({
      siteId: this.props.siteId,
      serverId: host,
      login
    })

    history.push(url);
  }

  searchAndFilterCb(targetValue, searchValue, propName){
    if(propName === 'tags'){
      return targetValue.some((item) => {
        const { name, value } = item;
        return name.toLocaleUpperCase().indexOf(searchValue) !==-1 ||
          value.toLocaleUpperCase().indexOf(searchValue) !==-1;
      });
    }
  }

  sortAndFilter(data, searchValue) {
    const { colSortDirs } = this.state;
    const filtered = data
      .filter(obj => isMatch(obj, searchValue, {
        searchableProps: this.searchableProps,
        cb: this.searchAndFilterCb
      }));

    const columnKey = Object.getOwnPropertyNames(colSortDirs)[0];
    const sortDir = colSortDirs[columnKey];
    let sorted = sortBy(filtered, columnKey);
    if(sortDir === SortTypes.ASC){
      sorted = sorted.reverse();
    }

    return sorted;
  }

  renderEmptyIndicator(searchValue) {
    return (
      <EmptyIndicator title={`No Results Found for "${searchValue}"`}>
        For tips on getting better search results, please read <a href="https://gravitational.com/teleport/docs">our documentation</a>
      </EmptyIndicator>
    );
  }

  render() {
    const { nodeRecords, logins, onLoginClick, searchValue } = this.props;
    const data = this.sortAndFilter(nodeRecords, searchValue);

    // no results found
    if(data.length === 0 && searchValue.length > 0) {
      return this.renderEmptyIndicator(searchValue);
    }

    return (
      <TablePaged rowCount={data.length} data={data} pageSize={50}>
        <Column
          onLoginClick={onLoginClick}
          header={<Cell>Login as</Cell> }
          cell={<LoginCell logins={logins}/> }
        />
        <Column
          columnKey="hostname"
          header={
            <SortHeaderCell
              sortDir={this.state.colSortDirs.hostname}
              onSortChange={this.onSortChange}
              title="Hostname"
            />
          }
          cell={<TextCell/> }
        />
        <Column
          columnKey="addr"
          header={
            <SortHeaderCell
              sortDir={this.state.colSortDirs.addr}
              onSortChange={this.onSortChange}
              title="Address"
            />
          }
          cell={<TextCell/> }
        />
        <Column
          header={<Cell>Labels</Cell> }
          cell={<TagCell/> }
        />

      </TablePaged>
    )
  }
}

export default NodeList;

const StyledTag = styled.div`
  background: ${props => props.theme.colors.bgQuaternary };
  border-radius: 200px;
  display: inline-block;
  margin: 0 8px 0 0;
  opacity: .56;
  padding: 0 8px;
`;


const StyledSession = styled.div`
  background: ${props => props.theme.colors.bgQuaternary };
  border-radius: 2px;
  display: flex;
  height: 24px;
  margin: 0 8px 0 0;
  position: relative;
  width: 56px;

  > ul {
    background: ${props => props.theme.colors.light };
    border-radius: 4px;
    box-sizing: border-box;
    box-shadow: 0 0 8px rgba(0, 0, 0, .12),  0 8px 32px rgba(0, 0, 0, .24);
    list-style-type: none;
    margin: 0;
    min-width: 136px;
    padding: 8px;
    position: absolute;
    top: 26px;
    z-index: 1;

    li {
      line-height: 32px;
      margin: 0;

      a {
        color: ${props => props.theme.colors.link };
        display: block;
        line-height: 32px;
        padding: 0 8px;
        text-decoration: none;
      }
    }

    input {
      background: ${props => props.theme.colors.subtle };
      border 1px solid ${props => props.theme.colors.subtle };
      border-radius: 2px;
      box-sizing: border-box;
      color: ${props => props.theme.colors.text };
      outline: none;
      padding: 0 8px;
      height: 40px;
      transition: all .3s;
      width: 100%;

      &:focus {
        background: ${props => props.theme.colors.light };
        border 1px solid ${props => props.theme.colors.link };
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, .24);
      }
    }
  }

  > button {
    background: none;
    border: none;
    cursor: pointer;
    height: 24px;
    margin: 0;
    outline: none;
    padding: 0;
    width: 24px;

    .icon {
      opacity: .56;
      transition: all .3s;
    }

    &:hover, &:focus {
      background: ${props => props.theme.colors.bgTertiary };
      transition: all .3s;

      .icon {
        opacity: 1;
      }
    }
  }

  > a {
    background: ${props => props.theme.colors.bgTerminal };
    border-radius: 2px 0 0 2px;
    border: 1px solid ${props => props.theme.colors.dark};
    box-sizing: border-box;
    box-shadow: 0 0 2px rgba(0, 0, 0, .12),  0 2px 2px rgba(0, 0, 0, .24);
    display: inline-block;
    height: 24px;
    overflow: hidden;
    position: relative;
    width: 32px;
    text-decoration: none;

    &:hover, &:focus {
      box-shadow: 0 0 8px rgba(0, 0, 0, .12),  0 8px 8px rgba(0, 0, 0, .24);

      > strong {
        opacity: 1;
      }

      .icon {
        opacity: 0;
      }
    }

    > strong {
      font-size:  ${props => props.theme.fontSizes[0] };
      font-weight: 500;
      color: ${props => props.theme.colors.terminal };
      display: block;
      opacity: 0;
      text-align: center;
      text-decoration: none;
      transition: all .3s;
    }

    .icon {
      font-size: 36px;
      opacity: .56;
      position: absolute;
      top: -6px;
      left: -2px;
      transition: all .3s;
    }
  }
`;