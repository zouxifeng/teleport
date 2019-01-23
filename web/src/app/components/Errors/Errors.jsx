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
import { Alert, Card as BaseCard} from 'shared/components';
import Typography from 'shared/components/Typography';
import * as Links from './../Links';

const NotFound = ({ message }) => (
  <Card>
    <CardHeader>404 Not Found</CardHeader>
    <CardContent message={message}/>
  </Card>
)

const AccessDenied = ({ message}) => (
  <Card>
    <CardHeader>Access denied</CardHeader>
    <CardContent message={message}/>
  </Card>
)

const Failed = ({message}) => (
  <Card>
    <CardHeader>Internal Error</CardHeader>
    <CardContent message={message}/>
  </Card>
)

const LoginFailed = ({ message }) => (
  <Card>
    <CardHeader>Login unsuccessful</CardHeader>
    <CardContent
      message={message}
      desc={(
        <span>
          <Links.Login>Please try again</Links.Login>, if the problem persists, contact your system administrator.
        </span>
      )}/>
  </Card>
)

export {
  NotFound,
  Failed,
  AccessDenied,
  LoginFailed
};


const CardHeader = props =>  (
  <Typography.h1 mb={4} textAlign="center" children={props.children}/>
)

const CardContent = ({ message='', desc }) => {
  const $desc = desc ? <Typography.p>{desc}</Typography.p> : null;
  const $errMessage = message ? <Alert mt={4}>{ message }</Alert> : null;

  return (
    <div>
      {$errMessage} {$desc}
      <Typography.p>
        If you believe this is an issue with Teleport,
        please <Links.NewIssue>create a GitHub issue.</Links.NewIssue>
      </Typography.p>
    </div>
  );
}

const Card = ({children}) => (
  <BaseCard
    color='text'
    bg='bgLight'
    width='540px'
    mx='auto'
    my={4}
    p={5}
    children={children}
  />
)