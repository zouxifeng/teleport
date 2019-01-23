import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'shared/components/Typography';
import InputSearch from 'app/components/InputSearch';
import { Flex } from 'shared/components';

const Header = ({
  title = '',
  onSearchChange = null,
  searchValue = ''
}) => {
  let $search = null;

  if(onSearchChange) {
    $search = <InputSearch autoFocus value={searchValue} onChange={onSearchChange} />;
  }

  return (
    <Flex>
      <Typography.h1 mr={5} mb={0}>{title}</Typography.h1>
      {$search}
    </Flex>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  searchValue: PropTypes.string,
};

Header.displayName = 'Header';

export default Header;

