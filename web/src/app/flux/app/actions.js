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

import reactor from 'app/reactor';
import  * as APP from './actionTypes';
import { RECEIVE_CLUSTERS } from './../sites/actionTypes';
import { RECEIVE_USER } from './../user/actionTypes';
import { RECEIVE_USERACL } from './../userAcl/actionTypes';
import api from 'app/services/api';
import cfg from 'app/config';
import { initAppStatus } from 'app/flux/status/actions';
import { fetchNodes } from './../nodes/actions';
import * as sessionActions from 'app/flux/sessions/actions';
import Logger from 'app/lib/logger';

const logger = Logger.create('flux/app');

export function addNavItem(item) {
  reactor.dispatch(APP.ADD_NAV_ITEM, item);
}

export function setSiteId(siteId) {
  reactor.dispatch(APP.SET_SITE_ID, siteId);
}

export function initApp(clusterId, featureActivator) {
  initAppStatus.start();
  // get the list of available clusters
  return fetchInitData(clusterId)
    .then(() => {
      featureActivator.onload();
      initAppStatus.success();
    })
    .catch(err => {
      initAppStatus.fail(err.message);
    })
}

export function refresh() {
  return Promise.all([
    sessionActions.fetchActiveSessions(),
    fetchNodes()]);
}

export function fetchInitData(clusterId) {
  return Promise.all([fetchSites(), fetchUserContext()])
    .then(([masterSiteId])=> {
      setSiteId(masterSiteId);
      clusterId = clusterId || masterSiteId;
      return Promise.all([
        fetchNodes(clusterId),
        sessionActions.fetchActiveSessions(clusterId)
      ])
    });
}

export function fetchSites(){
  return api.get(cfg.api.sitesBasePath)
    .then(json => {
      const trusted = json.trusted || [];
      const allClusters = [json.current, ...trusted];
      reactor.dispatch(RECEIVE_CLUSTERS, allClusters);
      return json.current.name;
  })
  .catch(err => {
    logger.error('fetchSites', err);
  })
}

export function fetchUserContext(){
  return api.get(cfg.api.userContextPath).then(json => {
    reactor.dispatch(RECEIVE_USER, { name: json.userName, authType: json.authType });
    reactor.dispatch(APP.SET_VERSION, json.version);
    reactor.dispatch(RECEIVE_USERACL, json.userAcl);
    logger.info("Teleport ver:", json.version);
  })
}
