import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import ButtonSso, { TypeEnum } from '../ButtonSso/ButtonSso'

storiesOf('ButtonSso', module)
  .addDecorator(withInfo)
  .addParameters({
    info: {
      inline: true,
      header: false
    },
  })
  .add('color', () => (
    <div style={{ width: "300px" }}>
      <ButtonSso mt={2} type={TypeEnum.MICROSOFT}>Microsoft</ButtonSso>
      <ButtonSso mt={2} type={TypeEnum.GITHUB}>Github</ButtonSso>
      <ButtonSso mt={2} type={TypeEnum.GOOGLE}>Google</ButtonSso>
      <ButtonSso mt={2} type={TypeEnum.BITBUCKET}>Bitbucket</ButtonSso>
      <ButtonSso mt={2} type="unknown">Unkown SSO</ButtonSso>
    </div>
  ))
