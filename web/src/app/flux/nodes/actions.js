import reactor from 'app/reactor';
import { TLPT_NODES_RECEIVE } from './actionTypes';
import api from 'app/services/api';
import cfg from 'app/config';
import Logger from 'app/lib/logger';

const logger = Logger.create('flux/nodes');

export function fetchNodes(clusterId) {
  return api.get(cfg.api.getSiteNodesUrl(clusterId))
    .then(res => res.items || [])
    .then(items => reactor.dispatch(TLPT_NODES_RECEIVE, items))
    .catch(err => {
      logger.error('fetchNodes', err);
      throw err;
    });
}
