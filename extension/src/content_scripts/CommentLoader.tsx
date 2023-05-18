import React, { useContext, useState} from 'react';
import { IsPostingContext } from './Combar';
import { Comment, ApiRequestInfo } from '../types';

const CommentLoader: React.FC = () => {
  const isPostingContext = useContext(IsPostingContext);
  if (!isPostingContext) {
    throw new Error('CommentPoster must be used within an IsPostingContext provider');
  }
  const [isPosting, setIsPosting] = isPostingContext;
  const [comments, setComments] = useState<Comment[]>([]);

  React.useEffect(() => {
    const currentUrl = encodeURIComponent(window.location.href);
    const apiRequestInfo: ApiRequestInfo = {
      url: "/api/urls/" + currentUrl + "/comments",
      method: "GET",
      body: null,
    }
    chrome.runtime.sendMessage({ action: 'apiRequest', apiRequestInfo: apiRequestInfo }, (response) => {
      if(response.error) console.error(response.error);
      else setComments(response as Comment[]);
    });
  }, [isPosting]);

  return (
    <>
      {comments.map((comment, index) => (
        <p key={index}>{comment.commentText}</p>
      ))}
    </>
  );
};
  
export default CommentLoader;