import { getTextBoxStyle, selectionStyle } from "../../styles";
import { Comment } from "../../types";
import { request } from "../../utils/apiRequests";

function findTextNodeByDomPath(
  domPath: string,
  startOffset: number,
  endOffset: number
): Text | null {
  const element = document.querySelector(domPath);
  if (!element) return null;

  let textNode: Text | null = null;

  const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

  do {
    const node = treeWalker.currentNode as Text;
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
      if (
        startOffset <= node.textContent.length &&
        endOffset <= node.textContent.length
      ) {
        textNode = node;
        break;
      }
    }
  } while (treeWalker.nextNode());

  return textNode;
}


function findScrollableParent(el: HTMLElement | null): HTMLElement | Window {
  while (el && el !== document.body) {
    const style = window.getComputedStyle(el);
    if (style.overflowY === "auto" || style.overflowY === "scroll") {
      return el;
    }
    el = el.parentElement;
  }
  return window;
}

export async function showComments() {
  const currentUrl = encodeURIComponent(window.location.href);
  request("/api/urls/" + currentUrl + "/selections")
    .then((response) => {
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
      textBoxContainer.addEventListener("scoll", updateTextBoxPositions);

      // highlight selected text and add text boxes for each comment
      const commentsList = response as Comment[];
      commentsList.forEach((comment) => {
        const contiguousSelectedText: HTMLElement[] = [];
        comment.paths.forEach((domPath, index) => {
          const startOffset = index === 0 ? comment.startOffset : 0;
          const textNode = findTextNodeByDomPath(domPath, startOffset, 0);
          if (!textNode) return;

          const endOffset =
            index === comment.paths.length - 1
              ? comment.endOffset
              : (textNode && textNode.length) || 0;

          const selectedText = document.createElement("span");
          Object.assign(selectedText.style, selectionStyle);

          const subRange = document.createRange();
          subRange.setStart(textNode, startOffset);
          subRange.setEnd(textNode, endOffset);

          subRange.surroundContents(selectedText);

          contiguousSelectedText.push(selectedText);
        });
        
        if (!contiguousSelectedText.length) return;
        const highlightRect = contiguousSelectedText[0].getBoundingClientRect();

        // add the text box
        const textBox: HTMLElement = document.createElement("div");
        textBox.classList.add("combar-text-box");
        textBox.innerText = "Enter your text here";
        Object.assign(
          textBox.style,
          getTextBoxStyle(highlightRect.top + window.scrollY)
        );

        textBoxContainer.appendChild(textBox);
      });
    })
    .catch((error) => {
      console.error("Error fetching selections based on", error);
    });
}
