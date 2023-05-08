import React from 'react';

const Popup = () => {
  const handleClick = () => {
    // send message to 
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'comment' });
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

export default Popup;
