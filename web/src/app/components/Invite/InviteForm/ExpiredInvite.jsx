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
import styled from 'styled-components';
import PropTypes from 'prop-types'
import { Card, Typography } from 'shared/components';

const ProductEnum = {
  Teleport: 'Teleport',
  Gravity: 'Gravity'
}
class ExpiredInvite extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { product } = this.props;
    return (
      <Card width="540px" color="text" p={5} bg="bgLight" mt={5} mx="auto">
        <Typography.h1
          textAlign="center"
          fontSize={8} color="text"
          fontWeight="bold"
          mb={3} >
          Invite code has expired
        </Typography.h1>
        <Typography.p>
          It appears that your invite code isn't valid anymore.
          Please contact your account administrator and request another invite.
        </Typography.p>
        <Typography.p>
          If you believe this is an issue with {product},
          please create a <GithubLink> GitHub issue</GithubLink>.
      </Typography.p>
      </Card>
    );
  }
}

const GithubLink = styled.a.attrs({
  href: 'https://github.com/gravitational/teleport/issues/new'
})`
  color: ${props => props.theme.colors.link};
  &:visted {
    color: ${props => props.theme.colors.link};
  }
`;

ExpiredInvite.propTypes = {
  /** The name of the product (gravity, teleport) */
  product: PropTypes.oneOf([ProductEnum.Gravity, ProductEnum.Teleport]),
};

ExpiredInvite.defaultProps = {
  product: ProductEnum.Teleport
};

export default ExpiredInvite;