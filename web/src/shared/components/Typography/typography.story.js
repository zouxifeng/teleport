import React from 'react'
import styled from 'styled-components';
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import Typography from '../Typography'

storiesOf('Typography', module)
  .addDecorator(withInfo)
  .addParameters({
    info: {
      inline: true,
      header: false,
    },
  })
  .add('Using dot-notation with h1-h6', () => (
    <Container width="200px" bg="bgQuaternary" p={2}>
      <Typography.h1 mt={3} bg="#F0F8FF" >H1 -> {text}</Typography.h1>
      <Typography.h2 mt={3} bg="#FAEBD7">H2 -> {text}</Typography.h2>
      <Typography.h3 mt={3} bg="#00FFFF">H3 -> {text}</Typography.h3>
      <Typography.h4 mt={3} bg="#7FFFD4">H4 -> {text}</Typography.h4>
      <Typography.h5 mt={3} bg="#F0FFFF">H5 -> {text}</Typography.h5>
      <Typography.p mt={3} bg="#FFE4C4">P -> {text}</Typography.p>
      <Typography.small mt={3} bg="#FFEBCD" >Small -> {text}</Typography.small>
    </Container>
  ))
  .add('Using Text props', () => (
    <section>
      <Typography.h1 textAlign="left" color="green">
        Typography.h1 Left
      </Typography.h1>
      <Typography.h1 textAlign="center"  color="blue">
        Typography.h1 Center
      </Typography.h1>
      <Typography.h1 textAlign="right" color="orange">
        Typography.h1 Right
      </Typography.h1>
    </section>
  ));

const Container = styled.div`
  padding: 16px;
  width: 400px;
  word-break: all;
  background-color: #1B234A;
  color: black;
`
const text = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book`;