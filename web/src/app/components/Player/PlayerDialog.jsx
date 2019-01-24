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
import Portal from 'shared/components/Modal/Portal';
import { close } from 'app/flux/player/actions';
import Player from './Player';
import { CloseButton as TermCloseButton } from './../Terminal/Elements';
import DocumentTitle from './../DocumentTitle';
import { Box } from 'shared/components';
import cfg from 'app/config';

class PlayerDialog extends React.Component {

  constructor(props) {
    super(props);
    const { sid, siteId } = props.match.params;
    this.url = cfg.api.getFetchSessionUrl({ siteId, sid });
  }

  onClose = () => {
    const { siteId } = this.props.match.params;
    close(siteId)
  }

  render() {
    const { siteId } = this.props.match.params;
    const title = `${siteId} · Player`;
    return (
      <Portal>
        <DocumentTitle title={title}>
          <StyledDialog>
            <StyledActionBar px={2}>
              <TermCloseButton onClick={this.onClose} />
            </StyledActionBar>
            <Player url={this.url}/>
          </StyledDialog>
        </DocumentTitle>
      </Portal>
    );
  }
}

const StyledActionBar = styled(Box)`
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  height: 32px;
`

const StyledDialog = styled.div`
  background-color:${props => props.theme.colors.bgTerminal};
  bottom: 0;
  display: flex;
  flex-direction: column;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
`;

export default PlayerDialog;