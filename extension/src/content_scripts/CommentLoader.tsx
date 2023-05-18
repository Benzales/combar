import React from 'react';
import { Comment, ApiRequestInfo } from '../types';

const CommentLoader: React.FC = () => {
  const [comments, setComments] = React.useState<Comment[]>([]);

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
  }, []);

  return (
    <>
      {comments.map((comment, index) => (
        <p key={index}>{comment.commentText}</p>
      ))}
    </>
  );
};
  
export default CommentLoader;