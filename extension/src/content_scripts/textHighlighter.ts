export const uniqueHighlightClass = 'unique-combar-highlight-class';

export const highlightSelection = (ancestor: HTMLElement, relativeStartOffset: number, relativeEndOffset: number): void => {
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

export const unhighlightSelection = (): void => {
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