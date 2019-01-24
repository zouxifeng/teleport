/*
Copyright 2018 Gravitational, Inc.

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
import { Card, Box, Flex, Typography, Input, Label, Button } from 'shared/components';
import * as Alerts from 'shared/components/Alert';
import { Auth2faTypeEnum } from '../../../services/enums';
import SsoButtonList from './SsoButtons';
import { Formik } from 'formik';

export default class LoginForm extends React.Component {

  initialValues = {
    password: '',
    user: '',
    token: ''
  }

  onValidate = values => {
    const errors = {};

    if (!values.user) {
      errors.user = ' is required';
    }

    if (!values.password) {
      errors.password = ' is required';
    }

    if (this.isOTP() && !values.token) {
      errors.token = ' is required';
    }

    return errors;
  }

  onLogin = values => {
    const { user, password, token } = values;
    if (this.props.auth2faType === Auth2faTypeEnum.UTF) {
      this.props.onLoginWithU2f(user, password);
    } else {
      this.props.onLogin(user, password, token);
    }
  }

  onLoginWithSso = ssoProvider => {
    this.props.onLoginWithSso(ssoProvider);
  }

  needs2fa() {
    return !!this.props.auth2faType &&
      this.props.auth2faType !== Auth2faTypeEnum.DISABLED;
  }

  needsSso() {
    return this.props.authProviders && this.props.authProviders.length > 0;
  }

  isOTP() {
    return this.needs2fa() && this.props.auth2faType === Auth2faTypeEnum.OTP;
  }

  renderLoginBtn(onClick) {
    const { isProcessing } = this.props.attempt;
    let $helpBlock = null;

    if(isProcessing && this.props.auth2faType === Auth2faTypeEnum.UTF) {
      $helpBlock = (
        <Typography.small width="100%" textAlign="center">
          Insert your U2F key and press the button on the key
        </Typography.small>
      );
    }

    const btnProps = {
      onClick,
      block: true,
      disabled: isProcessing,
      size: 'large',
      type: 'submit',
      mt: '5',
      mb: '2',
    }

    return (
      <React.Fragment>
        <Button {...btnProps}>
          SIGN INTO TELEPORT
        </Button>
        {$helpBlock}
      </React.Fragment>
    );
  }

  renderSsoBtns() {
    const { authProviders, attempt } = this.props;
    if (!this.needsSso()) {
      return null;
    }

    return (
      <SsoButtonList
        prefixText="Login with "
        isDisabled={attempt.isProcessing}
        providers={authProviders}
        onClick={this.onLoginWithSso} />
    )
  }

  renderTokenField({ values, errors, touched, handleChange}) {
    const isOTP = this.isOTP();
      const tokenError = Boolean(errors.token && touched.token);

    let $tokenField = null;

    if(isOTP) {
      $tokenField = (
        <Flex>
          <Box width="45%">
            <Label mt={3} hasError={tokenError}>
              Two factor token
              {tokenError && errors.token}
            </Label>
            <Input id="token"
              hasError={tokenError}
              autoComplete="off"
              value={values.token}
              onChange={handleChange}
              placeholder="123 456"
            />
          </Box>
          <Box ml="2" width="55%" textAlign="center" pt={3}>
            <Button target="_blank" block as="a" size="small" link href="https://support.google.com/accounts/answer/1066447?co=GENIE.Platform%3DiOS&hl=en&oco=0">
              Download Google Authenticator
            </Button>
          </Box>
        </Flex>
      );
    }

    return $tokenField;
  }

  renderInputFields({ values, errors, touched, handleChange }) {
    const userError = Boolean(errors.user && touched.user);
    const passError = Boolean(errors.password && touched.password);

    return (
      <React.Fragment>
        <Label hasError={userError}>
          USERNAME
          {userError && errors.user}
        </Label>
        <Input id="user" fontSize={0}
          autoFocus
          value={values.user}
          hasError={userError}
          onChange={handleChange}
          placeholder="User name"
          name="user"
          />
        <Label hasError={passError}>
          Password
          {passError && errors.password}
        </Label>
        <Input
          id="password"
          hasError={passError}
          value={values.password}
          onChange={handleChange}
          type="password"
          name="password"
          placeholder="Password"/>
      </React.Fragment>
    )
  }

  render() {
    const { isFailed, message } = this.props.attempt;
    return (
      <div>
        <Formik
          validate={this.onValidate}
          onSubmit={this.onLogin}
          initialValues={this.initialValues}
        >
          {
            props => (
              <Card as="form" bg="bgSecondary" my="4" mx="auto" width="456px">
                <Box p="5">
                  <Typography.h3 textAlign="center" color="light">
                    SIGN INTO TELEPORT
                  </Typography.h3>
                  { isFailed && <Alerts.Danger> {message} </Alerts.Danger>  }
                  {this.renderInputFields(props)}
                  {this.renderTokenField(props)}
                  {this.renderLoginBtn(props.handleSubmit)}
                </Box>
                <footer>
                  {this.renderSsoBtns()}
                </footer>
              </Card>
            )
        }
        </Formik>
      </div>
    );
  }
}
