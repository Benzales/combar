import React, { useState, useEffect } from 'react';
import { CompactMode, Sidebar } from '../styles';
import CommentLoader from './CommentLoader';
import CommentPoster from './CommentPoster';

const Combar: React.FC = () => {
  const [isCompactMode, setIsCompactMode] = useState<boolean>(true);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  useEffect(() => {
    window.postMessage({ type: "FROM_CONTENT_SCRIPT", text: "Hello from the content script!" }, "*");

    // Listen for a response
    window.addEventListener('message', function(event) {
      // We only accept messages from ourselves
      if (event.source !== window) return;

      if (event.data.type && (event.data.type === "FROM_PAGE")) {
        console.log("Page script has sent a response: " + event.data.text);
        chrome.runtime.sendMessage({from: 'content', accessToken: event.data.accessToken, refreshToken: event.data.refreshToken})
      }
    }, false);
  }, []);

  return (
    isCompactMode ? 
      <CompactMode onClick={() => setIsCompactMode(false)} > 
        <p> Open </p> 
      </CompactMode> : 
      <Sidebar isSelecting={isSelecting}>
        <button onClick={() => setIsCompactMode(true)}> Close </button>
        <h1>Combar</h1>
        <CommentPoster isPosting={isPosting} setIsPosting={setIsPosting} setIsSelecting={setIsSelecting} />
        <CommentLoader isPosting={isPosting} />
      </Sidebar>
  );
};

export default Combar;