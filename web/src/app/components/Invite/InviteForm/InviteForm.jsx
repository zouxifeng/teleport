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
import PropTypes from 'prop-types';
import { Auth2faTypeEnum } from 'app/services/enums';
import { Typography, Text, Card, Input, Label, Button } from 'shared/components';
import { Formik } from 'formik';
import Invite2faData from './TwoFaInfo';
import * as Alerts from 'shared/components/Alert';
import Flex from 'shared/components/Flex';
import Box from 'shared/components/Box';

const U2F_ERROR_CODES_URL = 'https://developers.yubico.com/U2F/Libraries/Client_error_codes.html';

const needs2fa = auth2faType => !!auth2faType && auth2faType !== Auth2faTypeEnum.DISABLED;

export class InviteForm extends React.Component {

  static propTypes = {
    auth2faType: PropTypes.string,
    authType: PropTypes.string,
    onSubmitWithU2f: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    attempt: PropTypes.object.isRequired
  }

  initialValues = {
    password: '',
    passwordConfirmed: '',
    token: ''
  }

  onValidate = values => {
    const { password, passwordConfirmed } = values;
    const errors = {};

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Enter at least 6 characters';
    }

    if (!passwordConfirmed) {
      errors.passwordConfirmed = 'Please confirm your password'
    }else if (passwordConfirmed !== password) {
      errors.passwordConfirmed = 'Password does not match'
    }

    if (this.isOTP() && !values.token) {
      errors.token = 'Token is required';
    }

    return errors;
  }

  onSubmit = values => {
    const { user, password, token } = values;
    if (this.props.auth2faType === Auth2faTypeEnum.UTF) {
      this.props.onSubmitWithU2f(user, password);
    } else {
      this.props.onSubmit(user, password, token);
    }
  }

  renderNameAndPassFields({ values, errors, touched, handleChange }) {
    const passError = touched.password && errors.password;
    const passConfirmedError = touched.passwordConfirmed && errors.passwordConfirmed;
    const tokenError = errors.token && touched.token;
    const { user } = this.props.invite;

    return (
      <React.Fragment>
        <Text breakAll mt={1} mb={3} fontSize={5}>
          {user}
        </Text>
        <Label hasError={passError}>
          {passError || "Password"}
        </Label>
        <Input
          hasError={passError}
          value={values.password}
          onChange={handleChange}
          type="password"
          name="password"
          placeholder="Password"
        />
        <Label hasError={passConfirmedError}>
          {passConfirmedError || "Confirm Password"}
        </Label>
        <Input
          hasError={passConfirmedError}
          value={values.passwordConfirmed}
          onChange={handleChange}
          type="password"
          name="passwordConfirmed"
          placeholder="Password"
        />
        {this.isOTP() && (
          <Flex>
            <Box width="45%" mr="0">
              <Label mt={3} mb={1} hasError={tokenError}>
                {(tokenError && errors.token) || "Two factor token"}
              </Label>
              <Input id="token" fontSize={0}
                hasError={tokenError}
                autoComplete="off"
                value={values.token}
                onChange={handleChange}
                placeholder="123 456"
              />
            </Box>
            <Box ml="2" width="55%" textAlign="center" pt={3}>
              <Button target="_blank" block as="a" size="small" link href="https://support.google.com/accounts/answer/1066447?co=GENIE.Platform%3DiOS&hl=en&oco=0">Download Google Authenticator</Button>
            </Box>
          </Flex>
        ) }
      </React.Fragment>
    )
  }

  isOTP() {
    let { auth2faType } = this.props;
    return needs2fa(auth2faType) && auth2faType === Auth2faTypeEnum.OTP;
  }

  renderSubmitBtn(onClick) {
    const { isProcessing } = this.props.attempt;
    const $helpBlock = isProcessing && this.props.auth2faType === Auth2faTypeEnum.UTF ? (
        "Insert your U2F key and press the button on the key"
    ) : null;

    const isDisabled = isProcessing;

    return (
      <>
        <Button
          block
          disabled={isDisabled}
          size="large"
          type="submit"
          onClick={onClick}
          mt={4}>
          Create My Teleport Account
      </Button>
      {$helpBlock}
      </>
    )
  }

  render() {
    const { auth2faType, invite, attempt } = this.props;
    const { isFailed, message } = attempt;
    const $error = isFailed ? <ErrorMessage message={message} /> : null;
    const needs2FAuth = needs2fa(auth2faType);
    const boxWidth = (needs2FAuth ? 712 : 464) + 'px';

    let $2FCode = null;
    if(needs2FAuth) {
      $2FCode = (
        <Box flex="1" bg="bgQuaternary" p="5">
          <Invite2faData auth2faType={auth2faType} qr={invite.qr} />
        </Box>
      );
    }

    return (
      <Formik
        validate={this.onValidate}
        onSubmit={this.onSubmit}
        initialValues={this.initialValues}
      >
        {
          props => (
            <Card as="form" bg="bgSecondary" my="4" mx="auto" width={boxWidth}>
              <Flex>
                <Box flex="3" p="5">
                  {$error}
                  {this.renderNameAndPassFields(props)}
                  {this.renderSubmitBtn(props.handleSubmit)}
                </Box>
                {$2FCode}
              </Flex>
            </Card>
          )
        }
        </Formik>
    )
  }
}


const U2FError = () => (
  <Typography.p>
    click <a target="_blank" href={U2F_ERROR_CODES_URL}>here</a>
    to learn more about U2F error codes
  </Typography.p>
)

export const ErrorMessage = ({ message }) => {
  message = message || '';
  const $helpBox = message.indexOf('U2F') !== -1 ? <U2FError/> : null
  return (
    <>
      <Alerts.Danger>{message} </Alerts.Danger>
      {$helpBox}
    </>
  )
}

export default InviteForm;