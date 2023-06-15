import React, { useEffect, useState } from 'react';
import { Comment, ApiRequestInfo } from '../types';
import { CommentBox, CommentHeader, ProfilePic, UserName, CommentText } from '../styles';
import { uniqueHighlightClass, highlightSelection, unhighlightSelection } from './textHighlighter';
import CommentReplier from './CommentReplier';
import CommentVoter from './CommentVoter';

interface CommentLoaderProps {
  isPosting: boolean;
}

const CommentLoader: React.FC<CommentLoaderProps> = ({ isPosting }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const findNode = (domPath: string): HTMLElement | null => {
    try {
      const node = document.querySelector(domPath) as HTMLElement;
      return node;
    } catch (e) {
      console.error("Invalid DOM Path", e);
      return null;
    }
  }

  const handleMouseEnter = (comment: Comment) => {
    const commonAncestorElement: HTMLElement | null = findNode(comment.pathToCommonAncestor);
    if (commonAncestorElement) {
      highlightSelection(commonAncestorElement, comment.startOffset, comment.endOffset);

      const firstHighlight = document.getElementsByClassName(uniqueHighlightClass)[0];
      if (firstHighlight) {
        const boundingRect = firstHighlight.getBoundingClientRect();
        const verticalPos = window.scrollY + boundingRect.top;
        const offset = 250;

        window.scroll({
          top: verticalPos - offset,
          behavior: 'smooth'
        });
      }
    }
  }

  const handleMouseLeave = () => {
    unhighlightSelection();
  }

  useEffect(() => {
    const currentUrl = encodeURIComponent(window.location.href);
    const apiRequestInfo: ApiRequestInfo = {
      url: "/api/urls/" + currentUrl + "/comments",
      method: "GET",
      body: null,
    }
    chrome.runtime.sendMessage({ action: 'apiRequest', apiRequestInfo: apiRequestInfo }, (response) => {
      if (response.error) console.error(response.error);
      else {
        console.log("Comments received from server:", response);
        setComments(response as Comment[]);
      } 
    });
  }, [isPosting]);

  return (
    <>
      {comments.map((comment, index) => (
        <>
          <CommentBox
            key={index}
            onMouseEnter={() => handleMouseEnter(comment)}
            onMouseLeave={() => handleMouseLeave()}
          >
            <CommentHeader>
              <ProfilePic />
              <UserName>{comment.username}</UserName>
            </CommentHeader>
            <CommentText>{comment.commentText}</CommentText>
          </CommentBox>
          <CommentReplier commentId={comment.id} />
          {/* <CommentVoter id={comment.id} votes={comment.votes}/> */}
          {comment.replies.map((reply) => (
            <>
              <p>{reply.replyText}</p>
              <CommentVoter id={reply.id} votes={reply.votes}/>
            </>
          ))
          }
        </>
      ))}
    </>
  );
};

export default CommentLoader;