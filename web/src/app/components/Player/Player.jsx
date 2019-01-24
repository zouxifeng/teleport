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
import ProgressBar from './ProgressBar';
import Xterm from './Xterm';
import Alert from 'shared/components/Alerts';
import { TtyPlayer } from 'app/lib/term/ttyPlayer';
import { Indicator, Text, Typography, Box } from 'shared/components';
export default class Player extends React.Component {

  constructor(props) {
    super(props);
    const { url } = this.props;
    this.tty = new TtyPlayer({url});
    this.state = this.calculateState();
  }

  calculateState(){
    return {
      eventCount: this.tty.getEventCount(),
      duration: this.tty.duration,
      min: 1,
      time: this.tty.getCurrentTime(),
      isLoading: this.tty.isLoading,
      isPlaying: this.tty.isPlaying,
      isError: this.tty.isError,
      errText: this.tty.errText,
      current: this.tty.current,
      canPlay: this.tty.length > 1
    };
  }

  componentDidMount() {
    this.tty.on('change', this.updateState);
    this.tty.connect();
    this.tty.play();
  }

  componentWillUnmount() {
    this.tty.stop();
    this.tty.removeAllListeners();
  }

  updateState = () => {
    const newState = this.calculateState();
    this.setState(newState);
  }

  onTogglePlayStop = () => {
    if(this.state.isPlaying){
      this.tty.stop();
    }
    else{
      this.tty.play();
    }
  }

  onMove = value => {
    this.tty.move(value);
  }

  renderConnectionError() {
    const {errText} = this.state;

    return (
      <Alert status="danger" m={10}>
        Connection Error
        <Text fontSize={1}> {errText || "Error"} </Text>
      </Alert>
    );
  }

  renderNoSession() {
    return (
      <Box m={10} textAlign="center">
        <Typography.h4>Recording for this session is not available.</Typography.h4>
      </Box>
    )
  }

  renderLoadingIndicator() {
    return (
      <Box textAlign="center" m={10}>
        <Indicator />
      </Box>
    );
  }

  renderProgressBar() {
    const {isPlaying, time, min, duration, current, eventCount} = this.state;
    let $progressBar = null;

    if(eventCount > 0) {
      $progressBar = (
        <ProgressBar
          isPlaying={isPlaying}
          time={time}
          min={min}
          max={duration}
          value={current}
          onToggle={this.onTogglePlayStop}
          onChange={this.onMove}/>
      );
    }

    return $progressBar;
  }

  renderPlayer() {
    return (
      <React.Fragment>
        <XtermBox px={2}>
          <Xterm tty={this.tty} />
        </XtermBox>
        {this.renderProgressBar()}
      </React.Fragment>
    );
  }

  render() {
    const {isError, isLoading, eventCount} = this.state;
    let $content = null;

    // error message
    if(isError) {
      $content = this.renderConnectionError();
    }
    // loading
    else if(isLoading) {
      $content = this.renderLoadingIndicator();
    }
    // no session available
    else if(!isLoading && eventCount === 0 ) {
      $content = this.renderNoSession();
    }
    // render session player
    else {
      $content = this.renderPlayer();
    }

    return (
      <StyledPlayer>
        {$content}
      </StyledPlayer>
    );
  }
}

const StyledPlayer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: space-between;
`;

const XtermBox = styled(Box)`
  height: 100%;
  overflow: auto;
  width: 100%;
`