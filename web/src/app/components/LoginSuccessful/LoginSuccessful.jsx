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
import Typography from 'shared/components/Typography';
import Logo from 'shared/components/Logo';
import logoSvg from 'shared/assets/images/teleport-medallion.svg';
import { Card, Button } from 'shared/components';
import * as Icons from 'shared/components/Icon';
import { withDocTitle } from './../DocumentTitle';

export const LoginSuccessful = () => (
  <>
    <Logo src={logoSvg}/>
    <Card width="540px" p={5} my={4} mx="auto" textAlign="center">
      <Icons.CircleCheck mb={3} fontSize={64} color="success"/>
      <Typography.h2>
        Login Successful
      </Typography.h2>
      <Typography.p>
        You have successfully signed into your account.
        You can close this window and continue using the product.
      </Typography.p>
      <Button secondary>Close Window</Button>
    </Card>
  </>
)

export default withDocTitle("Success", LoginSuccessful);