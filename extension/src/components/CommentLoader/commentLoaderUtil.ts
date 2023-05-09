import { getTextBoxStyle } from "../../styles";
import { Comment, Request } from "../../types";

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

export async function showComments() {
  const currentUrl = encodeURIComponent(window.location.href);
  const request: Request = {
    url: "/api/urls/" + currentUrl + "/selections",
    method: "GET",
    body: null,
  }
  chrome.runtime.sendMessage({ action: 'request', request: request }, (response) => {
    if(response.error) console.error(response.error);
    else {
      const updateTextBoxPositions = () => {
        const textBoxes = textBoxContainer.querySelectorAll(".combar-text-box");
        textBoxes.forEach((element) => {
          const textBox = element as HTMLElement;
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const highlightRect = range.getBoundingClientRect();
            textBox.style.top = `${highlightRect.top + window.scrollY}px`;
          }
        });
      }
      
      // create container for all text boxes
      const textBoxContainer = document.createElement("div");
      textBoxContainer.classList.add("combar-text-box-container");
      document.body.appendChild(textBoxContainer);
      window.addEventListener("scoll", updateTextBoxPositions);

      // highlight selected text and add text boxes for each comment
      const commentsList = response as Comment[];
      commentsList.forEach((comment) => {
        const textNodes: Text[] = comment.pathsToTextNode.flatMap((domPath) => {
          const textNode = findTextNodeByDomPath(domPath);
          return textNode ? [textNode] : [];
        });
        
        if (!textNodes.length) return;
        const midTextNode = textNodes[Math.floor(textNodes.length / 2)];
        if(midTextNode.parentElement) {
          const boundingRect = midTextNode.parentElement.getBoundingClientRect();

          // add the text box
          const textBox: HTMLElement = document.createElement("div");
          textBox.classList.add("combar-text-box");
          textBox.innerText = comment.commentText;
          Object.assign(
            textBox.style,
            getTextBoxStyle(boundingRect.top + window.scrollY)
          );
          textBoxContainer.appendChild(textBox);
        } else { console.log("midTextNode.parentElement is null"); }
      });
    }
  });
}
