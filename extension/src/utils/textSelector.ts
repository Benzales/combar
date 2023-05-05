import { SelectionData } from "../types";
import { request } from "./apiRequests";

let textBox: HTMLElement | null = null;

export function findScrollableParent(
  el: HTMLElement | null
): HTMLElement | Window {
  while (el && el !== document.body) {
    const style = window.getComputedStyle(el);
    if (style.overflowY === "auto" || style.overflowY === "scroll") {
      return el;
    }
    el = el.parentElement;
  }
  return window;
}

function getTextNodesInRange(range: Range): Text[] {
  const textNodes: Text[] = [];
  const treeWalker = document.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        return range.intersectsNode(node)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }
  );

  // Add this check to handle single text node selections
  if (
    range.startContainer.nodeType === Node.TEXT_NODE &&
    range.startContainer === range.endContainer
  ) {
    textNodes.push(range.startContainer as Text);
  } else {
    while (treeWalker.nextNode()) {
      textNodes.push(treeWalker.currentNode as Text);
    }
  }

  return textNodes;
}

function getDomPath(element: HTMLElement | null): string {
  if (!element) return "";

  let path: string[] = [];
  let node: HTMLElement | null = element;

  while (node && node.nodeType === Node.ELEMENT_NODE) {
    let selector: string = node.nodeName.toLowerCase();
    if (node.id) {
      selector += "#" + node.id;
      path.unshift(selector);
      break;
    } else {
      let sibling: HTMLElement | null = node;
      let siblingIndex: number = 1;
      while ((sibling = sibling.previousElementSibling as HTMLElement | null)) {
        if (sibling.nodeName.toLowerCase() === selector) siblingIndex++;
      }
      if (siblingIndex > 1) selector += ":nth-of-type(" + siblingIndex + ")";
    }
    path.unshift(selector);
    node = node.parentElement;
  }

  return path.join(" > ");
}

function findTextNodeByDomPath(
  domPath: string,
  startOffset: number,
  endOffset: number
): Text | null {
  const element = document.querySelector(domPath);
  if (!element) return null;

  let textNode: Text | null = null;
  const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  while (treeWalker.nextNode()) {
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
  }

  return textNode;
}

export function highlightSelectedText(selection: Selection): void {
  const range = selection.getRangeAt(0);

  const textNodes = getTextNodesInRange(range);
  if (!textNodes.length) return;

  const domPaths = textNodes.map((textNode) => {
    const parentElement = textNode.parentElement;
    return parentElement ? getDomPath(parentElement) : "";
  });

  let selectionData: SelectionData = {
    url: window.location.href,
    text: selection.toString(),
    paths: domPaths,
    startOffset: range.startOffset,
    endOffset: range.endOffset,
  };

  // store selection in database
  request("/api/selection", "POST", selectionData);

  const highlightStyle = {
    backgroundColor: "yellow",
    color: "black",
  };

  const highlights: HTMLElement[] = [];

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

  const highlightRect = highlights[0].getBoundingClientRect();

  textBox = document.createElement("div");
  textBox.innerText = "Enter your text here";
  textBox.style.position = "absolute";
  textBox.style.top = `${highlightRect.top + window.scrollY}px`;
  textBox.style.right = "0";
  textBox.style.padding = "10px";
  textBox.style.backgroundColor = "white";
  textBox.style.border = "1px solid black";

  document.body.appendChild(textBox);

  const scrollableParent: HTMLElement | Window = findScrollableParent(
    highlights[0]
  );
  scrollableParent.addEventListener("scroll", updateTextBoxPosition);
  window.addEventListener("scroll", updateTextBoxPosition);

  return;
}

export function updateTextBoxPosition(): void {
  if (textBox) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const highlightRect = range.getBoundingClientRect();
      textBox.style.top = `${highlightRect.top + window.scrollY}px`;
    }
  }
}
