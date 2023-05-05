import React from "react";

const changeBackgroundColor = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id as number, {
      action: "changeBackgroundColor",
    });
  });
};

const Popup: React.FC = () => {
  return (
    <div className="App">
      <h1>Social</h1>
      <button onClick={changeBackgroundColor}>Change Background Color</button>
    </div>
  );
};

export default Popup;
