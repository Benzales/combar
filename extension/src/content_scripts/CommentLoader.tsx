import React, { useEffect, useState} from 'react';
import { Comment, ApiRequestInfo } from '../types';
import { CommentBox, CommentHeader, ProfilePic, UserName, CommentText } from '../styles';
import profilepic from '../styles/profilepic.png';

interface CommentLoaderProps {
    isPosting: boolean;
}

const CommentLoader: React.FC<CommentLoaderProps> = ({ isPosting }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const findTextNodesByDomPaths = ( domPaths: string[] ): Text[] => {
    let textNodes: Text[] = domPaths.flatMap((domPath) => {
      const element = document.querySelector(domPath);
      if (!element) return [];
    
      let textNode: Text | null = null;
    
      const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    
      do {
        const node = treeWalker.currentNode as Text;
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
          textNode = node;
          break;
        }
      } while (treeWalker.nextNode());
      return textNode ? [textNode] : [];
    });
  
    return textNodes;
  }

  const handleMouseEnter = (comment: Comment) => {
    const range = new Range();
    
    const textNodes: Text[] = findTextNodesByDomPaths(comment.pathsToTextNode);
    if(textNodes.length && textNodes[0].parentElement) {
      const boundingRect = textNodes[0].parentElement.getBoundingClientRect();
      const verticalPos = boundingRect.top;
      
      window.scroll({
        top: verticalPos,
        behavior: 'smooth'
      });
    
      range.setStart(textNodes[0], comment.startOffset);
      range.setEnd(textNodes[textNodes.length - 1], comment.endOffset);
  
      const selection = window.getSelection();
      if(selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }

      // console.log('comment', comment);
      // console.log('text nodes', textNodes);
    }
      
  }
  
  const handleMouseLeave = (comment: Comment) => {
    console.log('bye', comment.selectedText);
  }

  useEffect(() => {
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
        <CommentBox 
          key={index}
          onMouseEnter={() => handleMouseEnter(comment)}
          onMouseLeave={() => handleMouseLeave(comment)}
        >
          <CommentHeader>
            <ProfilePic />
            <UserName>{"Ben Gonzales"}</UserName>
          </CommentHeader>
          <CommentText>{comment.commentText}</CommentText>
        </CommentBox>
      ))}
    </>
  );
};
  
export default CommentLoader;