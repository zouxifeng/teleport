import React from 'react';
import { storiesOf } from '@storybook/react';
import Player from './Player';
import { TtyPlayer } from 'app/lib/term/ttyPlayer';
import sample from 'app/lib/term/fixtures/streamData';
import styled from 'styled-components';

storiesOf('Teleport/Player', module)
  .add('loading', () => {
    const tty = new TtyPlayer("url");
    tty.connect = () => null;
    return (
      <MockedPlayer tty={tty} />);
  })
  .add('error', () => {
    const tty = new TtyPlayer("url");
    tty.connect = () => null;
    tty.handleError("Unable to find")
    return (
      <MockedPlayer tty={tty} />);
  })
  .add('not available (proxy enabled)', () => {
    const tty = new TtyPlayer("url");
    tty.connect = () => null;
    tty._setStatusFlag({ isReady: true });
    return (
      <MockedPlayer tty={tty} />);
  })
  .add('with content', () => {
    const tty = new TtyPlayer("url");
    const events = tty._eventProvider._createEvents(sample.events);
    tty._eventProvider._fetchEvents = () => Promise.resolve(events);
    tty._eventProvider._fetchContent = () => Promise.resolve(sample.data);
    return (
      <Box>
        <MockedPlayer tty={tty} />
      </Box>
    );
  });

class MockedPlayer extends Player {
  constructor(props) {
    super(props);
    this.tty = props.tty
  }
}

const Box = styled.div`
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  position: absolute;
`