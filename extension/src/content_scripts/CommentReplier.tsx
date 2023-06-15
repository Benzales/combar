import React, { useState } from 'react';
import { ApiRequestInfo } from '../types';

interface CommentReplierProps {
  commentId: number;
}

const CommentReplier: React.FC<CommentReplierProps> = ({commentId}) => {
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');

  const handleReplyClick = () => {
    setIsPosting(true);

  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handlePostClick = (event: React.FormEvent) => {
    event.preventDefault();
    const apiRequestInfo: ApiRequestInfo = {
      url: "/api/comments/" + commentId + "/replies",
      method: "POST",
      body: {"replyText": userInput},
    }
    chrome.runtime.sendMessage({ action: 'apiRequest', apiRequestInfo: apiRequestInfo }, (response) => {
      if (response.error) console.error(response.error);
      setUserInput('');
      setIsPosting(false);
    });
  }

  return (
    <>
      {isPosting ? 
        <>
          <form onSubmit={handlePostClick}>
            <input
              type="text"
              placeholder="Type your reply..."
              value={userInput}
              onChange={handleInputChange}
            />
            <button type="submit"> Post </button>
          </form>
        </> 
        :
        <button onClick={handleReplyClick}> Reply </button>
      }
    </>
  );
}

export default CommentReplier;