import React from 'react';
import * as RouterDOM from 'react-router-dom';
import { NotFound } from './../Errors';

const NoMatch = ({ location }) => (
  <NotFound message={location.pathname}/>
)

// Adds default not found handler
const Switch = props => (
  <RouterDOM.Switch>
    {props.children}
    <Route component={NoMatch}/>
  </RouterDOM.Switch>
)

const Route = RouterDOM.Route;
const NavLink = RouterDOM.NavLink;

export {
  Route,
  Switch,
  NavLink
}