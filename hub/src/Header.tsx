import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import Profile from './Profile';
import { ProfilePic } from './styles/comments';
import { LogoPic} from './styles/about';

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
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  & a {
    color: white;
    margin: 0 15px;
    text-decoration: none;

    &:hover {
      color: #61dafb;
    }
  }
`;

const ScopeLinks = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PageLinks = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
        <div></div>
        <ScopeLinks>
          <Link to="/">Recommended</Link>
          <Link to="/">Following</Link>
        </ScopeLinks>
        <PageLinks>
          {/* <Link to="/notifications">Notification Center</Link> */}
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <ProfilePic onClick={openModal} />
        </PageLinks>
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
