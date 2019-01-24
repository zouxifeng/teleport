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
import { connect } from './../nuclear';
import termGetters from 'app/flux/terminal/getters';
import { getters as fileGetters } from 'app/flux/fileTransfer';
import * as terminalActions  from 'app/flux/terminal/actions';
import * as playerActions from 'app/flux/player/actions';
import * as fileActions from 'app/flux/fileTransfer/actions';
import ActionBar from './ActionBar/ActionBar';
import { Indicator, Flex, Text, Button, Box, Typography } from 'shared/components';
import * as Icon from 'shared/components/Icon';
import Xterm from './Xterm/Xterm';
import FileTransferDialog from './FileTransfer';
import Portal from 'shared/components/Modal/Portal';
import * as Alerts from 'shared/components/Alert';
import { fonts } from 'shared/components/theme';
export class Terminal extends React.Component {

  constructor(props){
    super(props)
  }

  componentDidMount() {
    setTimeout(() => this.props.initTerminal(this.props.termParams), 0);
  }

  startNew = () => {
    const newTermParams = {
      ...this.props.termParams,
      sid: undefined
    }

    this.props.updateRoute(newTermParams);
    this.props.initTerminal(newTermParams);
  }

  replay = () => {
    const { siteId, sid } = this.props.termParams;
    this.props.onOpenPlayer(siteId, sid);
  }

  onCloseFileTransfer = () => {
    this.props.onCloseFileTransfer();
    if (this.termRef) {
      this.termRef.focus();
    }
  }

  onOpenUploadDialog = () => {
    this.props.onOpenUploadDialog(this.props.termParams);
  }

  onOpenDownloadDialog = () => {
    this.props.onOpenDownloadDialog(this.props.termParams);
  }

  onClose = () => {
    this.props.onClose(this.props.termParams.siteId);
  }

  renderXterm(termStore) {
    const { status } = termStore;
    const title = termStore.getServerLabel();

    if (status.isLoading) {
      return (
        <Box textAlign="center" m={10}>
          <Indicator />
        </Box>
      );
    }

    if (status.isError) {
      return <ErrorIndicator text={status.errorText} />;
    }

    if (status.isNotFound) {
      return (
        <SidNotFoundError
          onReplay={this.replay}
          onNew={this.startNew} />);
    }

    if (status.isReady) {
      const ttyParams = termStore.getTtyParams();
      return (
        <Xterm ref={e => this.termRef = e}
          title={title}
          onSessionEnd={this.onClose}
          ttyParams={ttyParams} />
      );
    }

    return null;
  }

  render() {
    const {
      termStore,
      fileStore,
      onTransferUpdate,
      onTransferStart,
      onTransferRemove
    } = this.props;

    const title = termStore.getServerLabel();
    const isFileTransferDialogOpen = fileStore.isOpen;
    const $xterm = this.renderXterm(termStore);


    return (
      <Portal>
        <StyledTerminal>
          <FileTransferDialog
            store={fileStore}
            onTransferRemove={onTransferRemove}
            onTransferUpdate={onTransferUpdate}
            onTransferStart={onTransferStart}
            onClose={this.onCloseFileTransfer}
          />
          <Flex flexDirection="column" height="100%" width="100%">
            <Box px={2}>
              <ActionBar
                onOpenUploadDialog={this.onOpenUploadDialog}
                onOpenDownloadDialog={this.onOpenDownloadDialog}
                isFileTransferDialogOpen={isFileTransferDialogOpen}
                title={title}
                onClose={this.onClose} />
            </Box>
            <XtermBox px={2}>
              {$xterm}
            </XtermBox>
          </Flex>
        </StyledTerminal>
      </Portal>
    );
  }
}

const ErrorIndicator = ({ text }) => (
  <Alerts.Danger m={10}>
    Connection error
    <Text fontSize={1}> {text} </Text>
  </Alerts.Danger>
)

const SidNotFoundError = ({ onNew, onReplay }) => (
  <Box my={10} mx="auto" width="300px">
    <Typography.h4 textAlign="center">The session is no longer active</Typography.h4>
    <Button block onClick={onNew} my={4}>
      <Icon.Cli /> Start New Session
    </Button>
    <Button block secondary onClick={onReplay}>
      <Icon.CirclePlay /> Replay Session
    </Button>
  </Box>
)

function mapStoreToProps() {
  return {
    termStore: termGetters.store,
    fileStore: fileGetters.store
  }
}

function mapStateToProps(props) {
  const { sid, login, siteId, serverId } = props.match.params;
  return {
    onOpenUploadDialog: fileActions.openUploadDialog,
    onOpenDownloadDialog: fileActions.openDownloadDialog,
    onTransferRemove: fileActions.removeFile,
    onTransferStart: fileActions.addFile,
    onTransferUpdate: fileActions.updateStatus,
    onCloseFileTransfer: fileActions.closeDialog,
    onClose: terminalActions.close,
    onOpenPlayer: playerActions.open,
    updateRoute: terminalActions.updateRoute,
    initTerminal: terminalActions.initTerminal,
    termParams: {
      sid,
      login,
      siteId,
      serverId,
    }
  }
}

export default connect(mapStoreToProps, mapStateToProps)(Terminal);

const XtermBox = styled(Box)`
  height: 100%;
  overflow: auto;
  width: 100%;
`

const StyledTerminal = styled.div`
  background-color:${props => props.theme.colors.bgTerminal};
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;

  .grv-terminal {
    height: 100%;
    width: 100%;
    font-size: 14px;
    line-height: normal;
    overflow: auto;
  }

  .grv-terminal .terminal {
    font-family: ${fonts.mono};
    border: none;
    font-size: inherit;
    line-height: normal;
    position: relative;
  }

  .grv-terminal .terminal .xterm-viewport {
    background-color:${props => props.theme.colors.bgTerminal};
    overflow-y: hidden;
  }

  .grv-terminal .terminal * {
    font-weight: normal!important;
  }
`;
