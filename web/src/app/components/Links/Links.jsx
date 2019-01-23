import React from 'react';
import cfg from 'app/config';

function makeLink(url){
  return props => (
    <a href={url}>{props.children}</a>
  )
}

export const Login = makeLink(cfg.routes.login);
export const NewIssue = makeLink('https://github.com/gravitational/teleport/issues/new');
