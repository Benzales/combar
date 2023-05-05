import { SelectionData } from "../../types";
import { request } from "../../utils/apiRequests";

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
      if (node.classList.length > 0) {
        console.log("node.classList: ", node.classList);
        selector += "." + Array.from(node.classList).join(".");
      }

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

export function selectText(selection: Selection): void {
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
  }
  