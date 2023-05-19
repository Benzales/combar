import styled from 'styled-components';

interface SidebarProps {
  isSelecting: boolean;
}

export const Sidebar = styled.div<SidebarProps>`
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
  opacity: ${props => props.isSelecting ? 0.2 : 1}; // adjust as necessary
`;
