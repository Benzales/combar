import React from "react";
import { selectText } from './textSelectorUtil';
import { Comment } from '../../types';

const TextSelector: React.FC = () => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'comment') {
      document.addEventListener("mouseup", handleMouseUp);
    }
  });
  
  const handleMouseUp = async () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const comment: Comment | undefined = await selectText(selection);
      document.removeEventListener("mouseup", handleMouseUp);
    }
  };

  return null;
};

export default TextSelector;
