import { create } from "domain";
import { getTextBoxStyle } from "../styles";
import { Comment, ApiRequestInfo } from "../types";

function findTextNodeByDomPath( domPath: string ): Text | null {
  const element = document.querySelector(domPath);
  if (!element) return null;

  let textNode: Text | null = null;

  const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

  do {
    const node = treeWalker.currentNode as Text;
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
      textNode = node;
      break;
    }
  } while (treeWalker.nextNode());

  return textNode;
}

function getVerticalPos(comment: Comment): number {
  const textNodes: Text[] = comment.pathsToTextNode.flatMap((domPath) => {
    const textNode = findTextNodeByDomPath(domPath);
    return textNode ? [textNode] : [];
  });
  
  if (!textNodes.length) return 0;
  const midTextNode = textNodes[Math.floor(textNodes.length / 2)];
  if(!midTextNode.parentElement) return 0;
  const boundingRect = midTextNode.parentElement.getBoundingClientRect();
  return boundingRect.top;
}

export function createTextBox(comment: Comment): HTMLTextAreaElement {
  const textBox: HTMLTextAreaElement = document.createElement("textarea");
  textBox.value = comment.commentText;
  textBox.rows = 1; // Set the initial number of rows
  textBox.classList.add("combar-text-box");
  if (comment.commentText.length > 0) textBox.readOnly = true;
  const verticalPos: number = getVerticalPos(comment);
  Object.assign(
    textBox.style,
    getTextBoxStyle(verticalPos + window.scrollY)
  );

  // Add an event listener to auto-resize the textarea
  textBox.addEventListener('input', (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = (target.scrollHeight) + 'px';
  });

  return textBox;
}

export async function showComments(textBoxContainer: HTMLElement) {
  const currentUrl = encodeURIComponent(window.location.href);
  const apiRequestInfo: ApiRequestInfo = {
    url: "/api/urls/" + currentUrl + "/comments",
    method: "GET",
    body: null,
  }
  chrome.runtime.sendMessage({ action: 'apiRequest', apiRequestInfo: apiRequestInfo }, (response) => {
    if(response.error) console.error(response.error);
    else {
      // add text box for each comment
      const commentsList = response as Comment[];
      commentsList.forEach((comment) => {
        // add the text box
        const textBox: HTMLTextAreaElement  = createTextBox(comment);
        textBoxContainer.appendChild(textBox);
      });
    }
  });
}
