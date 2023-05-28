import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import Profile from './Profile';
import {ProfilePic} from './styles';
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <h2>Edit Profile</h2>
        <button onClick={closeModal}>close</button>

        <Profile />
      </Modal>
    </HeaderContainer>
  );
}

export default Header;
