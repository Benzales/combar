import React, { useState } from 'react';
import { Sidebar } from '../styles';
import CommentLoader from './CommentLoader';
import CommentPoster from './CommentPoster';

export const IsPostingContext = React.createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(undefined);

const Combar: React.FC = () => {
  const [isPosting, setIsPosting] = useState<boolean>(false);

  return (
    <IsPostingContext.Provider value={[isPosting, setIsPosting]}>
        <Sidebar>
            <h1>Combar</h1>
            <CommentPoster />
            <CommentLoader />
        </Sidebar>
    </IsPostingContext.Provider>
        
  );
};

export default Combar;
