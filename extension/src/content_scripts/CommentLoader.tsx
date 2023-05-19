import React, { useContext, useState} from 'react';
import { Comment, ApiRequestInfo } from '../types';

interface CommentLoaderProps {
    isPosting: boolean;
}

const CommentLoader: React.FC<CommentLoaderProps> = ({ isPosting }) => {
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