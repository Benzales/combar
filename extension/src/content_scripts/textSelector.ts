import { Comment } from "../types";

// gets offsets relative to the common ancestor element
function getSelectionOffsets(range: Range, commonAncestorElement: Node): [number, number] {
  let totalCharacters = 0;
  let startOffset: number | null = null;
  let endOffset: number | null = null;

  const treeWalker = document.createTreeWalker(commonAncestorElement, NodeFilter.SHOW_TEXT);

  while (treeWalker.nextNode()) {
    const textNode = treeWalker.currentNode as Text;

    if (textNode === range.startContainer) {
      startOffset = totalCharacters + range.startOffset;
    }

    if (textNode === range.endContainer) {
      endOffset = totalCharacters + range.endOffset;
    }

    // Add the length of the current text node to the total character count
    totalCharacters += textNode.length;

    // If we've found both the start and end nodes, we can stop walking the tree
    if (startOffset !== null && endOffset !== null) {
      break;
    }
  }

  if (startOffset === null || endOffset === null) {
    throw new Error('Could not find start and/or end node within common ancestor');
  }

  return [startOffset, endOffset];
}

// generates XPath for a given DOM node
function getDomPath(element: HTMLElement | null): string {
  if (!element) return "";

  let path: string[] = [];
  let node: HTMLElement | null = element;

  while (node) {
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


export async function selectText(selection: Selection): Promise<Comment | undefined> {
  const range = selection.getRangeAt(0);

  const commonAncestorElement = range.commonAncestorContainer.nodeType === Node.TEXT_NODE 
    ? (range.commonAncestorContainer as Text).parentElement
    : range.commonAncestorContainer as HTMLElement;

  if (!commonAncestorElement) throw new Error('Common ancestor element is null');
  console.log('commonAncestorElement', commonAncestorElement);

  const [startOffset, endOffset] = getSelectionOffsets(range, commonAncestorElement);

  let comment: Comment = {
    url: encodeURIComponent(window.location.href),
    pathToCommonAncestor: getDomPath(commonAncestorElement),
    startOffset: startOffset,
    endOffset: endOffset,
    commentText: "error occured while creating comment",
    selectedText: selection.toString(),
    username: "anonymous",
    id: -1
  };
  return comment;
}