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
import { getUrlParameter } from 'app/services/browser';
import { withDocTitle } from './../DocumentTitle';
import Logo from 'shared/components/Logo';
import logoSvg from 'shared/assets/images/teleport-medallion.svg';

import {
  NotFound,
  Failed,
  AccessDenied,
  LoginFailed
} from './../Errors'

export const AppErrorEnum = {
  FAILED_TO_LOGIN: 'login_failed',
  NOT_FOUND: 'not_found',
  ACCESS_DENIED: 'access_denied'
};

const mapToCmpt = {
  [AppErrorEnum.FAILED_TO_LOGIN]: LoginFailed,
  [AppErrorEnum.NOT_FOUND]: NotFound,
  [AppErrorEnum.ACCESS_DENIED]: AccessDenied,
}

export const AppError = ({ category, message }) => {
  const Cmpt = mapToCmpt[category] || Failed;
  return (
    <div>
      <Logo src={logoSvg}/>
      <Cmpt message={message}/>
    </div>
  );
};

export default withDocTitle("Error", ({ match }) => {
  const category = match.params.type;
  const message = getUrlParameter('details');
  return (
    <AppError category={category} message={message} />
  )
});


