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
import { AuthProviderTypeEnum } from 'app/services/enums';
import SsoButton from './../SsoButton';
import { Box } from 'shared/components';

function guessProviderType(name, type) {
  name = name.toLowerCase();

  if (name.indexOf('microsoft') !== -1) {
    return 'microsoft';
  }

  if (name.indexOf('bitbucket') !== -1) {
    return 'bitbucket';
  }

  if (name.indexOf('google') !== -1) {
    return 'google';
  }

  if (name.indexOf('github') !== -1 || type === AuthProviderTypeEnum.GITHUB ) {
    return 'github';
  }

  if (type === AuthProviderTypeEnum.OIDC) {
    return 'openid';
  }

  return '--unknown';
}

const SsoBtnList = ({providers, prefixText, isDisabled, onClick}) => {
  const $btns = providers.map((item, index) => {
    let { name, type, displayName } = item;
    displayName = displayName || name;
    const title = `${prefixText} ${displayName}`
    const ssoType = guessProviderType(displayName, type);
    return (
      <SsoButton key={index}
        type={ssoType}
        mt={4}
        disabled={isDisabled}
        onClick={e => { e.preventDefault(); onClick(item) }}>
        {title}
      </SsoButton>
    )
  })

  if ($btns.length === 0) {
    return (
      <h4> You have no SSO providers configured </h4>
    )
  }

  return  (
    <Box px={5} pt={2} pb={5}>
      {$btns}
    </Box>
  )
}

export default SsoBtnList;
