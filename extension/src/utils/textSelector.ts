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
        return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    }
  );

  // Add this check to handle single text node selections
  if (range.startContainer.nodeType === Node.TEXT_NODE && range.startContainer === range.endContainer) {
    textNodes.push(range.startContainer as Text);
  } else {
    while (treeWalker.nextNode()) {
      textNodes.push(treeWalker.currentNode as Text);
    }
  }

  return textNodes;
}

export function highlightSelectedText(
  selection: Selection
): void {
  const range = selection.getRangeAt(0);

  const textNodes = getTextNodesInRange(range);
  console.log(textNodes.length);
  if (!textNodes.length) return;

  const highlightStyle = {
    backgroundColor: "yellow",
    color: "black",
  };

  const highlights: HTMLElement[] = [];

  textNodes.forEach((textNode, index) => {
    const highlight = document.createElement("span");
    Object.assign(highlight.style, highlightStyle);

    const startOffset = index === 0 ? range.startOffset : 0;
    const endOffset = index === textNodes.length - 1 ? range.endOffset : textNode.length;

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

  const scrollableParent: HTMLElement | Window =
    findScrollableParent(highlights[0]);
  scrollableParent.addEventListener("scroll", updateTextBoxPosition);
  window.addEventListener("scroll", updateTextBoxPosition);

  return;
}

export function updateTextBoxPosition(): void {
  if (textBox) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      console.log("updateTextBoxPosition");
      const range = selection.getRangeAt(0);
      const highlightRect = range.getBoundingClientRect();
      textBox.style.top = `${highlightRect.top + window.scrollY}px`;
    }
  }
}
