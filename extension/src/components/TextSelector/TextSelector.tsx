import React, { useEffect } from "react";
import { selectText } from './textSelectorUtil';

const TextSelector: React.FC = () => {
  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      selectText(selection);
    }
  };

  return null;
};

export default TextSelector;
