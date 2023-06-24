import styled from 'styled-components';

export const CommentContainer = styled.div`
  position: fixed;
  height: 100%;
  right: 25%;
  width: 50%; 
  background-color: #f5f5f5;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

export const CommentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
    background-color: #eee;
  }
`;
interface ProfilePicProps {
  src: string;
}

export const ProfilePic = styled.div`
  width: 2em;
  height: 2em;
  margin-right: 0px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-color: #ccc;
  flex-shrink: 0;
`;

export const CommentHeader = styled.div`
  justify-content: flex-start;
  align-items: left;
  margin-bottom: 0px;
`;

export const UserName = styled.p`
  margin: 0;
  font-weight: bold;
`;

export const CommentText = styled.p`
  margin: 0;
`;

export const CenteredHeading = styled.h1`
  text-align: left;
`;