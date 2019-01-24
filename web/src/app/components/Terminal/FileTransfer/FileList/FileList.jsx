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
import { FileListItemReceive, FileListItemSend } from './../FileListItem';
import { Box } from 'shared/components'

export default function FileList ({ files, onUpdate, onRemove }) {
  if (files.length === 0) {
    return null;
  }

  const $files = files.map(file => {
    const key = file.id
    const props = {
      onUpdate,
      key,
      file,
      onRemove
    };

    return file.isUpload ?
      <FileListItemSend {...props}  /> :
      <FileListItemReceive {...props} />
  });

  return (
    <List mt={3}>
      <ListHeaders>
        <ListTitle width="360px">File</ListTitle>
        <ListTitle width="80px" textAlign="right">Status</ListTitle>
      </ListHeaders>
      <ListItems>
        {$files}
      </ListItems>
    </List>
  )
}

const List = styled(Box)`
`

const ListTitle = styled(Box)`
  text-transform: uppercase;
  font-weight: ${ props => props.theme.bold };
`

const ListHeaders = styled.div`
  display: flex;
  justify-content: space-between;
`

const ListItems = styled.div`
  overflow: auto;
  max-height: 300px;
  // scrollbars
  padding-right: 16px;
  margin-right: -16px;
`