import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
// Styled Header
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #282c34;
  color: white;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
`;

const Logo = styled.h1`
  font-size: 1.5em;
`;

const Navigation = styled.nav`
  & a {
    color: white;
    margin-right: 15px;
    text-decoration: none;

    &:hover {
      color: #61dafb;
    }
  }
`;

// Header component
function Header() {
  return (
    <HeaderContainer>
      <Logo>combar</Logo>
      <Navigation>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </Navigation>
    </HeaderContainer>
  );
}

export default Header;
