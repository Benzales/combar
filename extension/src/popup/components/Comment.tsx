import React from 'react';

const Comment = () => {
  const handleClick = () => {
    // send message to 
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'select-text' });
      }
    });
  };

  return (
    <div>
      <h1>Combar</h1>
      <button onClick={handleClick}>comment</button>
    </div>
  );
};

export default Comment;
