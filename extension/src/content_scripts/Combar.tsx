import React, { useState, useEffect } from 'react';
import { Sidebar } from '../styles';
import CommentLoader from './CommentLoader';
import CommentPoster from './CommentPoster';

const Combar: React.FC = () => {
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("message", function(event) {
      // We only accept messages from ourselves
      if (event.source != window) return;
      
      if (event.data.type && (event.data.type == "FROM_PAGE")) {
          chrome.runtime.sendMessage({from: 'content', accessToken: event.data.accessToken, refreshToken: event.data.refreshToken})
      }
    }, false);
  }, []);

  return (
    <Sidebar isSelecting={isSelecting}>
      <h1>Combar</h1>
      <CommentPoster isPosting={isPosting} setIsPosting={setIsPosting} setIsSelecting={setIsSelecting} />
      <CommentLoader isPosting={isPosting} />
    </Sidebar>
  );
};

export default Combar;