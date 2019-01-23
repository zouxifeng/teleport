import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { getStore } from 'app/flux/app/appStore';
import cfg from 'app/config';
import LogoButton from 'shared/components/LogoButton';
import teleportLogo from 'shared/assets/images/teleport-logo.svg';

const AppLogo = ({
  version,
}) => {
  return (
    <LogoButton src={teleportLogo} version={version} as={NavLink}
      to={cfg.routes.app} />
  );
};

AppLogo.displayName = 'AppLogo';
AppLogo.propTypes = {
  version: PropTypes.string,
};

export default function withVersion() {
  const ver = getStore().version || 'unknown version';
  return <AppLogo version={ver}/>
}