import React from 'react'
import { storiesOf } from '@storybook/react'
import { UserList } from './UserList'

let defaultProps = {
  parties: [{
    user: 'John Smith'
  }]
}

storiesOf('Teleport/Terminal/UserList', module)
  .add('UserList', () => {
    const props = {
      ...defaultProps,
    }

    return (
      <UserList {...props} />
    );
  })