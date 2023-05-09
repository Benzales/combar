import { Comment } from "../../types";

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

  do {
    textNodes.push(treeWalker.currentNode as Text);
  } while (treeWalker.nextNode());

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

export async function selectText(selection: Selection): Promise<Comment | undefined> {
    const range = selection.getRangeAt(0);
  
    const textNodes = getTextNodesInRange(range);
    if (textNodes.length) {
      const domPaths = textNodes.map((textNode) => {
        const parentElement = textNode.parentElement;
        return parentElement ? getDomPath(parentElement) : "";
      });
    
      let comment: Comment = {
        url: window.location.href,
        pathsToTextNode: domPaths,
        startOffset: range.startOffset,
        endOffset: range.endOffset,
        commentText: "",
        selectedText: selection.toString(),
      };
      return comment;
    } else {
      console.error("No text nodes found");
    }
  }
  