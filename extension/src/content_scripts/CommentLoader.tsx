import React, { useEffect, useState } from 'react';
import { Comment, ApiRequestInfo } from '../types';
import { CommentBox, CommentHeader, ProfilePic, UserName, CommentText } from '../styles';

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

  const uniqueHighlightClass = 'unique-combar-highlight-class';

  const highlightSelection = (ancestor: HTMLElement, relativeStartOffset: number, relativeEndOffset: number): void => {
    let charCount = 0;
    let startOffset: number = -1;
    let endOffset: number = -1;
    let textNodes: Node[] = [];

    (function findNodes(node: Node) {
      for (let child = node.firstChild; child; child = child.nextSibling) {
        if (child.nodeType === Node.TEXT_NODE && child.textContent && endOffset < 0) {
          const nextCharCount = charCount + child.textContent.length;
          const startNodeHere: boolean = startOffset < 0 && relativeStartOffset >= charCount && relativeStartOffset <= nextCharCount;
          const endNodeHere: boolean = endOffset < 0 && relativeEndOffset >= charCount && relativeEndOffset <= nextCharCount;
          if (startNodeHere) startOffset = relativeStartOffset - charCount;
          if (endNodeHere) endOffset = relativeEndOffset - charCount;

          // once we have found the first node
          if (startOffset >= 0) textNodes.push(child);
          charCount = nextCharCount;
        } else if (endOffset < 0) {
          findNodes(child);
        } else {
          break;
        }
      }
    })(ancestor);

    // Check if both nodes were found
    if (startOffset >= 0 && endOffset >= 0) {
      textNodes.forEach((textNode, index) => {
        const highlight = document.createElement("span");
        highlight.className = uniqueHighlightClass;
        Object.assign(highlight.style, {
          backgroundColor: "yellow",
        });

        const subRange = document.createRange();
        subRange.setStart(textNode, index === 0 ? startOffset : 0);
        subRange.setEnd(textNode, index === textNodes.length - 1 ? endOffset : (textNode as Text).textContent?.length || 0);

        subRange.surroundContents(highlight);
      });
    }
  };

  const unhighlightSelection = (): void => {
    const highlightedEls = document.getElementsByClassName(uniqueHighlightClass); // Get all elements with the unique class
    for (let i = highlightedEls.length - 1; i >= 0; i--) { // Loop through elements in reverse to avoid issues with changing list
      let highlightedEl = highlightedEls[i];
      let parent = highlightedEl.parentNode;
      while (highlightedEl.firstChild) {
        parent?.insertBefore(highlightedEl.firstChild, highlightedEl);
      }
      parent?.removeChild(highlightedEl);
    }
  };

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
      else setComments(response as Comment[]);
    });
  }, [isPosting]);

  return (
    <>
      {comments.map((comment, index) => (
        <CommentBox
          key={index}
          onMouseEnter={() => handleMouseEnter(comment)}
          onMouseLeave={() => handleMouseLeave()}
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