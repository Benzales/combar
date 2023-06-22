
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import Profile from './Profile';
import { ProfilePic } from './styles/comments';
import { LogoPic} from './styles/about';
import React, { useState } from "react";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #282c34;
  color: white;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
`;

const Logo = styled.h1`
  font-size: 1.5em;
  margin-left: 70px;
`;

const Navigation = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & a {
    color: white;
    margin-right: 15px;
    text-decoration: none;

    &:hover {
      color: #61dafb;
    }
  }
`;

const CustomModal = styled(Modal)`
  position: fixed;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background-color: white;
  border-radius: 4px;
  padding: 20px;
`;

Modal.setAppElement("#root");

// Header component
function Header() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  return (
    <HeaderContainer>
      <Logo>combar</Logo>
      <Navigation>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <ProfilePic onClick={openModal} />
      </Navigation>
      {modalIsOpen && (
        <CustomModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
        >
          <Profile />
        </CustomModal>
      )}
    </HeaderContainer>
  );
}



export default Header;
