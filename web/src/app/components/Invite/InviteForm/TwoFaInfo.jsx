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
import styled from 'styled-components';
import { Auth2faTypeEnum } from 'app/services/enums';
import Typography from 'shared/components/Typography';

const U2F_HELP_URL = 'https://support.google.com/accounts/answer/6103523?hl=en';

export default function Invite2faData(props) {
  const { auth2faType, qr } = props;
  const imgSrc = `data:image/png;base64,${qr}`;

  if (auth2faType === Auth2faTypeEnum.OTP) {
    return (
      <div>
        <Typography.h5>
          Scan the bar code with Google Authenticator to generate a two factor token.
        </Typography.h5>
        <img width="168" src={imgSrc} />
      </div>
    )
  }

  if (auth2faType === Auth2faTypeEnum.UTF) {
    return (
      <div>
        <Typography.h4>
          Insert your U2F key
        </Typography.h4>
        <H5 fontSize={1}>
          Press the button on the U2F key after you press the sign up button
        </H5>
        <H5 fontSize={1}>
          <a a target="_blank" href={U2F_HELP_URL}>Learn more</a> about U2F 2-Step Verification.
        </H5>
      </div>
    )
  }

  return null;
}

const H5 = styled(Typography.h5)`
  line-height: 20px;
  opacity: .87;
  a {
    color: inherit;
  }
`