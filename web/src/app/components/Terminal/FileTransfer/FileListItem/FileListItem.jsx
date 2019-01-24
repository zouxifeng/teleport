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

import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import * as Icons from 'shared/components/Icon';
import { Uploader, Downloader } from 'app/services/fileTransfer';
import withHttpRequest from './withHttpRequest';
import { CloseButton as TermCloseButton } from './../../Elements';

export default class FileListItem extends Component {

  static propTypes = {
    file: PropTypes.object.isRequired,
    httpResponse: PropTypes.object,
    onRemove: PropTypes.func.isRequired,
  }

  savedToDisk = false;

  onRemove = () => {
    this.props.onRemove(this.props.file.id);
  }

  componentDidUpdate() {
    const { isCompleted, isUpload } = this.props.file;
    if (isCompleted && !isUpload) {
      this.saveToDisk(this.props.httpResponse)
    }
  }

  saveToDisk({ fileName, blob }) {
    if (this.savedToDisk) {
      return;
    }

    this.savedToDisk = true;

    // if IE11
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
      return;
    }

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  render() {
    const { httpProgress, file } = this.props;
    const {name, isFailed, isProcessing, isCompleted, error} = file;

    let statusText = `${httpProgress}%`;
    if(isFailed) {
      statusText = 'failed';
    }

    if(isCompleted) {
      statusText = 'complete';
    }

    return (
      <StyledFileListItem>
        <Progress>
          <ProgressIndicator isCompleted={isCompleted} progress={httpProgress}>
            {name}
          </ProgressIndicator>
          <CancelButton show={isProcessing} onClick={this.onRemove}/>
          <ProgressStatus isFailed={isFailed}>
            {statusText}
          </ProgressStatus>
        </Progress>
         <Error show={isFailed} text={error}/>
      </StyledFileListItem>
    )
  }
}

const FileListItemSend = withHttpRequest(Uploader)(FileListItem);
const FileListItemReceive = withHttpRequest(Downloader)(FileListItem);

export {
  FileListItemReceive,
  FileListItemSend
}

const Error = ({show, text}) => {
  return show ? <StyledError>{text}</StyledError> : null;
}

const CancelButton = ({ show, onClick }) => {
  return show ? <StyledButton onClick={onClick}><Icons.Close/></StyledButton> : null;
}

const StyledFileListItem = styled.div`
  margin-top: 4px;
`

const StyledError = styled.div`
  height: 16px;
  line-height: 16px;
  color: ${({theme}) => theme.colors.error};
`;

const Progress = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ProgressStatus = styled.div`
  fontSize: 12px;
  height: 24px;
  line-height: 24px;
  width: 80px;
  text-align: right;
  color: ${props => props.isFailed ? props.theme.colors.error : props.theme.colors.terminal };
`;

const ProgressIndicator = styled.div`
  background-image: linear-gradient(
    to right,
    ${props => props.theme.colors.terminalDark} 0%,
    ${props => props.theme.colors.terminalDark} ${props => props.progress}%,
    ${props => props.theme.colors.bgTerminal} 0%, ${props => props.theme.colors.bgTerminal} 100%
  );

  background: ${props => props.isCompleted ? 'none' : ''};
  color: ${props => props.isCompleted ? props.theme.colors.inverse : props.theme.colors.terminal};
  height: 24px;
  line-height: 24px;
  width: 360px;

`;

const StyledButton = styled(TermCloseButton)`
  background: ${props => props.theme.colors.error};
  color: ${props => props.theme.colors.light};
  font-size: 12px;
  height: 12px;
  width: 12px;
`