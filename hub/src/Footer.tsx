import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Styled Footer
const FooterContainer = styled.footer`
  display: fixed;
  height: 50px;  /* Increase this value for a bigger footer */
  justify-content: center;
  align-items: center;
  padding: 0px;
  background-color: #282c34;
  color: white;
  bottom: 0;
  width: 100%;
`;

const FooterLink = styled.a`
  color: white;
  margin: 0 15px;
  text-decoration: none;

  &:hover {
    color: #61dafb;
  }
`;
const Navigation = styled.nav`
  display: flex;
  justify-content: space-between; // Distribute items evenly
  align-items: center; // Vertically align items in the center

  & a {
    color: white;
    margin-right: 15px;
    text-decoration: none;

    &:hover {
      color: #61dafb;
    }
  }
`;

// Footer component
function Footer() {
  return (
    <FooterContainer>
      <Navigation>
      <Link to="/about">About</Link>
      <Link to="/privatepolicy">Private Policy</Link>
      <Link to="/termsandconditions">Terms & Conditions</Link>
      </Navigation>
    </FooterContainer>
  );
}

export default Footer;
