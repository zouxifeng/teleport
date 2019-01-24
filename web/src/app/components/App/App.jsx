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

import React, { Component } from 'react';
import { Route, Switch } from './../Router'
import styled from 'styled-components';
import { connect } from './../nuclear';
import { getters } from 'app/flux/app/appStore';
import { Failed } from './../Errors';
import { initApp } from 'app/flux/app/actions';
import { Indicator } from 'shared/components';
import { withAuth } from './../Hoc';
import FeatureActivator from './../../featureActivator';
import Clusters from './../Clusters';
import Cluster from './../Cluster';
import Account from './../Settings';
import cfg from 'app/config';
import Logger from 'app/lib/logger';

const logger = Logger.create('components/app');

class App extends Component {

  state = {
    renderingError: null
  }

  static getDerivedStateFromError(error) {
    return { renderingError: error };
  }

  componentDidCatch(err) {
    logger.error('render', err);
  }

  componentDidMount() {
    const featureActivator = new FeatureActivator();
    const { match } = this.props;
    initApp(match.params.siteId, featureActivator);
  }

  render() {
    const { initAttempt } = this.props;
    const { isProcessing, isSuccess, isFailed, message } = initAttempt;

    if (isFailed) {
      return <Failed message={message}/>
    }

    if (this.state.renderingError) {
      return <Failed message={this.state.renderingError.message}/>
    }

    if (isProcessing) {
      return (
        <StyledIndicator>
          <Indicator />
        </StyledIndicator>
      )
    }

    if (!isSuccess) {
      return null;
    }

    return (
      <StyledApp>
        <Switch>
          <Route exact path={cfg.routes.app} component={Clusters} />
          <Route exact path={cfg.routes.settingsAccount} component={Account} />
          <Route path={cfg.routes.cluster} component={Cluster} />
        />
        </Switch>
      </StyledApp>
    );
  }
}

function mapStateToProps() {
  return {
    initAttempt: getters.initAttempt
  }
}

export default withAuth(connect(mapStateToProps)(App));

const StyledApp = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
`

const StyledIndicator = styled(StyledApp)`
  display: flex;
  align-items: center;
  justify-content: center;
`