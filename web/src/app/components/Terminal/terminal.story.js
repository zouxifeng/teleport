import React from 'react'
import { storiesOf } from '@storybook/react'
import { Terminal } from './Terminal'
import { TermRec } from 'app/flux/terminal/store';
import { FileTransferStore } from 'app/flux/fileTransfer/store';

let defaultProps = {
  onAddFile: () => null,
  onCloseFileTransfer: () => null,
  onClose: () => null,
  onOpenPlayer: () => null,
  updateRoute: () => null,
  onTransferRemove: () => null,
  onTransferStart: () => null,
  onTransferUpdate: () => null,
  initTerminal: () => null,
  onOpenUploadDialog: () => null,
  onOpenDownloadDialog: () => null,
  termParams: {
    sid: 'test',
    login: 'test',
    siteId: 'test',
    serverId: 'test',
  },
  termStore: new TermRec(),
  fileStore: new FileTransferStore(),
}

storiesOf('Teleport/Terminal', module)
  .add('Loading', () => {
    const props = {
      ...defaultProps,
      termStore: new TermRec(termJson).setStatus({ isLoading: true })
    }

    return (
      <Terminal {...props} />
    );
  })
  .add('Error', () => {
    const props = {
      ...defaultProps,
      termStore: new TermRec(termJson).setStatus({
        isError: true,
        errorText: 'system error with long text'
      })
    }

    return (
      <Terminal {...props} />
    );
  })
  .add('NotFound', () => {
    const props = {
      ...defaultProps,
      termStore: new TermRec(termJson).setStatus({
        isNotFound: true,
      })
    }

    return (
      <Terminal {...props} />
    );
  });

const termJson = {
  hostname: 'localhost',
  login: 'support',
}