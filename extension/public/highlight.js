let textBox;

function findScrollableParent(el) {
  console.log("findScrollableParent");
  while (el && el !== document.body) {
    const style = window.getComputedStyle(el);
    if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
      console.log("scrollable parent found");
      return el;
    }
    el = el.parentElement;
  }
  return window;
}

function highlightSelectedText() {
  console.log("something selected");
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);

  const highlight = document.createElement('span');
  highlight.style.backgroundColor = 'green';
  highlight.style.color = 'black';

  range.surroundContents(highlight);

  const highlightRect = highlight.getBoundingClientRect();

  textBox = document.createElement('div');
  textBox.innerText = 'Enter your text here';
  textBox.style.position = 'absolute';
  textBox.style.top = `${highlightRect.top + window.scrollY}px`;
  textBox.style.right = '0';
  textBox.style.padding = '10px';
  textBox.style.backgroundColor = 'white';
  textBox.style.border = '1px solid black';

  document.body.appendChild(textBox);

  const scrollableParent = findScrollableParent(highlight);
  scrollableParent.addEventListener('scroll', updateTextBoxPosition);
  window.addEventListener('scroll', updateTextBoxPosition);
}

document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (selection.toString().length > 0) {
    highlightSelectedText();
  }
});

function updateTextBoxPosition() {
  if (textBox) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const highlightRect = range.getBoundingClientRect();
      textBox.style.top = `${highlightRect.top + window.scrollY}px`;
    }
  }
}
