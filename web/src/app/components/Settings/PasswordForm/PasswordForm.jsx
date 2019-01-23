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
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { Auth2faTypeEnum } from 'app/services/enums';
import { Card, Input, Label, Button } from 'shared/components';
import Alert from 'shared/components/Alerts';

const defaultState = {
  oldPass: '',
  newPass: '',
  newPassConfirmed: '',
  token: ''
}

class PasswordForm extends React.Component {

  static propTypes = {
    attempt: PropTypes.object.isRequired,
    onChangePass: PropTypes.func.isRequired,
    onChangePassWithU2f: PropTypes.func.isRequired
  }

  initialValues = {
    oldPass: '',
    newPass: '',
    newPassConfirmed: '',
    token: ''
  }

  hasBeenClicked = false;

  state = { ...defaultState };

  componentWillUnmount() {
    this.props.onDestory && this.props.onDestory();
  }

  onSubmit = values => {
    const { oldPass, newPass, token } = values;
    if (this.props.auth2faType === Auth2faTypeEnum.UTF) {
      this.props.onChangePassWithU2f(oldPass, newPass);
    } else {
      this.props.onChangePass(oldPass, newPass, token);
    }
  }

  onValidate = values => {
    const { oldPass, newPass, token, newPassConfirmed } = values;
    const errors = {};

    if (!oldPass) {
      errors.oldPass = 'Current Password is required';
    }

    if (!newPass) {
      errors.newPass = 'Password cannot be empty';
    } else if (oldPass.length < 6) {
      errors.newPass = 'Enter at least 6 characters';
    }

    if (!newPassConfirmed) {
      errors.newPassConfirmed = 'Please confirm your new password'
    }else if (newPassConfirmed !== newPass) {
      errors.newPassConfirmed = 'Password does not match'
    }

    if (this.isOtp() && !token) {
      errors.token = 'Token is required';
    }

    return errors;
  }

  isU2f() {
    return this.props.auth2faType === Auth2faTypeEnum.UTF;
  }

  isOtp() {
    return this.props.auth2faType === Auth2faTypeEnum.OTP;
  }

  renderFields({ values, errors, touched, handleChange }) {
    const isOtpEnabled = this.isOtp();
    const oldPassError = touched.oldPass && errors.oldPass;
    const newPassError = touched.newPass && errors.newPass;
    const newPassConfirmedError = touched.newPassConfirmed && errors.newPassConfirmed;
    const tokenError = touched.token && errors.token;

    return (
      <React.Fragment>
        <Label hasError={Boolean(oldPassError)}>
          {oldPassError || "Current Password"}
        </Label>
        <Input
          hasError={Boolean(oldPassError)}
          value={values.oldPass}
          onChange={handleChange}
          type="password"
          name="oldPass"
          placeholder="Password"
        />
        {isOtpEnabled &&
          <React.Fragment>
            <Label hasError={Boolean(tokenError)}>
              {tokenError || "2nd factor token"}
            </Label>
            <Input
              width="50%"
              hasError={Boolean(tokenError)}
              value={values.oldPass}
              onChange={handleChange}
              type="text"
              name="token"
              placeholder="OTP Token"
            />
          </React.Fragment>
        }
        <Label hasError={Boolean(newPassError)}>
          {newPassError || "New Password"}
        </Label>
        <Input
          hasError={Boolean(newPassError)}
          value={values.newPass}
          onChange={handleChange}
          type="password"
          name="newPass"
          placeholder="New Password"
        />
        <Label hasError={Boolean(newPassConfirmedError)}>
          {newPassConfirmedError || "Confirm Password"}
        </Label>
        <Input
          hasError={Boolean(newPassConfirmedError)}
          value={values.newPassConfirmed}
          onChange={handleChange}
          type="password"
          name="newPassConfirmed"
          placeholder="Confirm Password"
        />
      </React.Fragment>
    )
  }

  renderAttempt(attempt) {
    const { isFailed, isProcessing, isSuccess, message } = attempt;
    const waitForU2fKeyResponse = isProcessing && this.isU2f();

    if (isFailed) {
      return (
        <Alert status="danger">
          {message}
        </Alert>
      )
    }

    if (isSuccess) {
      return (
        <Alert status="success">
          Your password has been changed
        </Alert>
      )
    }

    if (waitForU2fKeyResponse) {
      return (
        <Alert status="info">
          Insert your U2F key and press the button on the key
        </Alert>
      )
    }

    return null;
  }

  render() {
    const { attempt } = this.props;
    return (
      <Formik
        validate={this.onValidate}
        onSubmit={this.onSubmit}
        initialValues={this.initialValues}
        >
        {props => (
          <Card as="form" bg="bgSecondary" mt="4" mb="4" width="456px" p="5">
            {this.renderAttempt(attempt)}
            {this.renderFields(props)}
            <Button
              block
              disabled={attempt.isProcessing}
              size="large"
              type="submit"
              onClick={props.handleSubmit}
              mt={4}>
              Update Password
            </Button>
          </Card>
        )}
      </Formik>
    )
  }
}

export default PasswordForm;