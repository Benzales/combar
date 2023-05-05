import { start } from "repl";
import { getTextBoxStyle, highlightStyle } from "../../styles";
import { SelectionData } from "../../types";
import { request } from "../../utils/apiRequests";

let textBox: HTMLElement | null = null;

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

function updateTextBoxPosition(): void {
  if (textBox) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const highlightRect = range.getBoundingClientRect();
      textBox.style.top = `${highlightRect.top + window.scrollY}px`;
    }
  }
}

export async function showComments() {
  const currentUrl = encodeURIComponent(window.location.href);
  request("/api/urls/" + currentUrl + "/selections")
    .then((response) => {
      const selectionDataList = response as SelectionData[];

      const highlights: HTMLElement[] = [];

      selectionDataList.forEach((selectionData) => {
        selectionData.paths.forEach((domPath, index) => {
          const startOffset = index === 0 ? selectionData.startOffset : 0;
          const textNode = findTextNodeByDomPath(domPath, startOffset, 0);
          if (!textNode) return;

          const endOffset =
            index === selectionData.paths.length - 1
              ? selectionData.endOffset
              : (textNode && textNode.length) || 0;

          const highlight = document.createElement("span");
          Object.assign(highlight.style, highlightStyle);

          const subRange = document.createRange();
          subRange.setStart(textNode, startOffset);
          subRange.setEnd(textNode, endOffset);

          subRange.surroundContents(highlight);

          highlights.push(highlight);
        });
        
        if (!highlights.length) return;
        const highlightRect = highlights[0].getBoundingClientRect();

        textBox = document.createElement("div");
        textBox.innerText = "Enter your text here";
        Object.assign(
          textBox.style,
          getTextBoxStyle(highlightRect.top + window.scrollY)
        );

        document.body.appendChild(textBox);

        const scrollableParent: HTMLElement | Window = findScrollableParent(
          highlights[0]
        );
        scrollableParent.addEventListener("scroll", updateTextBoxPosition);
        window.addEventListener("scroll", updateTextBoxPosition);
      });
    })
    .catch((error) => {
      console.error("Error fetching selections based on", error);
    });
}
