import React, { useEffect } from "react";
import { highlightSelectedText } from "../utils/textSelector";

const TextSelectorComponent: React.FC = () => {
  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      highlightSelectedText(selection);
    }
  };

  return null;
};

export default TextSelectorComponent;
