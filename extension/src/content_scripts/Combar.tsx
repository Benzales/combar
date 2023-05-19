import React, { useState } from 'react';
import { Sidebar } from '../styles';
import CommentLoader from './CommentLoader';
import CommentPoster from './CommentPoster';

const Combar: React.FC = () => {
    const [isPosting, setIsPosting] = useState<boolean>(false);
    const [isSelecting, setIsSelecting] = useState<boolean>(false);
  
    return (
      <Sidebar isSelecting={isSelecting}>
          <h1>Combar</h1>
          <CommentPoster isPosting={isPosting} setIsPosting={setIsPosting} isSelecting={isSelecting} setIsSelecting={setIsSelecting} />
          <CommentLoader isPosting={isPosting}/>
      </Sidebar>
    );
  };
  
  export default Combar;