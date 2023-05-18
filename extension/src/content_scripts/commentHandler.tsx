import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Combar from "./Combar";

export const IsPostingContext = React.createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(undefined);

const CommentHandler = () => {
  const [isPosting, setIsPosting] = useState<boolean>(false);

  return (
    <IsPostingContext.Provider value={[isPosting, setIsPosting]}>
        <Combar />
    </IsPostingContext.Provider>
  );
};

const rootElement = document.createElement('div');
rootElement.id = 'my-extension-root';
document.body.appendChild(rootElement);

ReactDOM.render(<CommentHandler />, rootElement);
