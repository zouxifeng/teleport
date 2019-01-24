import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import Alert from './index';

storiesOf('Alert', module)
  .addDecorator(withInfo)
  .addParameters({
    info: {
      inline: true,
      header: false,
    },
  })
  .add('Alert Component', () => {
    return (
      <Alert>This is an error message</Alert>
    );
  })
  .add('Danger Alert', () => {
    return (
      <Alert status="danger">This is an error message</Alert>
    );
  })
  .add('Warning Alert', () => {
    return (
      <Alert status="warning">This is a warning message</Alert>
    );
  })
  .add('Info Alert', () => {
    return (
      <Alert status="info">This is a informational message</Alert>
    );
  })
  .add('Success Alert', () => {
    return (
      <Alert status="success">This is a success message</Alert>
    );
  });
