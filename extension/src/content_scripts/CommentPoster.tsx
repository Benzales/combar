import React, { useEffect, useContext, useState } from 'react';
import { selectText } from './textSelector';
import { Comment } from '../types';

interface CommentPosterProps {
  isPosting: boolean;
  setIsPosting: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSelecting: React.Dispatch<React.SetStateAction<boolean>>;
}
const CommentPoster: React.FC<CommentPosterProps> = ({ isPosting, setIsPosting, setIsSelecting }) => {
  const [newComment, setNewComment] = useState<Comment>();
  const [userInput, setUserInput] = useState<string>('');
  const [selectedText, setSelectedText] = useState<string>('');

  const handleCommentClick = () => {
    setIsSelecting(true);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handlePostClick = (event: React.FormEvent) => {
    event.preventDefault();
    const updatedComment = {
      ...newComment,
      commentText: userInput,
    };
    const apiRequestInfo = {
      url: "/api/comments",
      method: "POST",
      body: updatedComment,
    }
    chrome.runtime.sendMessage({ action: 'apiRequest', apiRequestInfo: apiRequestInfo }, (response) => {
      if (response.error) console.error(response.error);
      setUserInput('');
      setIsPosting(false);
    });
  };

  const handleMouseUp = async () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setIsSelecting(false);
      document.removeEventListener("mouseup", handleMouseUp);
      const _newComment: Comment | undefined = await selectText(selection);
      if (_newComment) {
        setNewComment(_newComment);
        setIsPosting(true);
      }
    }
  };

  return (
    <>
      {isPosting ?
        <>
          <p> Selected Text: {selectedText}</p>
          <form onSubmit={handlePostClick}>
            <input
              type="text"
              placeholder="Type your comment..."
              value={userInput}
              onChange={handleInputChange}
            />
            <button type="submit"> Post </button>
          </form>
        </>
        :
        <>
          <button onClick={handleCommentClick}> Comment </button>
        </>
      }
    </>
  )
};

export default CommentPoster;