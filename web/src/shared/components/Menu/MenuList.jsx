import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class MenuList extends React.Component {
  render() {
    const { children, ...other } = this.props;
    return (
      <StyledMenuList
        role="menu"
        {...other}
      >
        {children}
      </StyledMenuList>
    );
  }
}

const StyledMenuList = styled.div`
  background-color: ${props => props.theme.colors.bgLight};
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .24);
  box-sizing: border-box;
  max-height: calc(100% - 96px);
  overflow: hidden;
  position: relative;
  padding:0;

  ${ props => props.menuListCss && props.menuListCss(props) }
`

MenuList.propTypes = {
  /**
   * MenuList contents, normally `MenuItem`s.
   */
  children: PropTypes.node,
  /**
   * @ignore
   */
  menuListCss: PropTypes.func,
};

export default MenuList;