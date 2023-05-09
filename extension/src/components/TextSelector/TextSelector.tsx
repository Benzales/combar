import React from "react";
import { selectText } from './textSelectorUtil';
import { Comment, Request } from '../../types';

const TextSelector: React.FC = () => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'select-text') {
      document.addEventListener("mouseup", handleMouseUp);
    }
  });
  
  const handleMouseUp = async () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const comment: Comment | undefined = await selectText(selection);
      document.removeEventListener("mouseup", handleMouseUp);
      
      const request: Request = {
        url: "/api/selection",
        method: "POST",
        body: comment
      }
      chrome.runtime.sendMessage({ action: 'request', request: request }, (response) => {
        if(response.error) console.error(response.error);
        else console.log(response.data);
      });
    }
      
  };

  return null;
};

export default TextSelector;
