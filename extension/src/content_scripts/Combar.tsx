import React from 'react';
import styled from 'styled-components';
import CommentLoader from './CommentLoader';
import CommentPoster from './CommentPoster';

const Sidebar = styled.div`
  position: fixed;
  top: 50%;
  right: 20px;
  height: 60vh;
  width: 230px; 
  transform: translateY(-50%);
  background-color: #f5f5f5;
  padding: 16px;
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Combar: React.FC = () => {
  return (
    <Sidebar>
      <h1>Combar</h1>
      <CommentPoster />
      <CommentLoader />
    </Sidebar>
  );
};

export default Combar;
