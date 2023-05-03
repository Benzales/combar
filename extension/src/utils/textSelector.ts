let textBox: HTMLElement | null = null;

export function findScrollableParent(el: HTMLElement | null): HTMLElement | Window {
    while (el && el !== document.body) {
        const style = window.getComputedStyle(el);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          return el;
        }
        el = el.parentElement;
      }
      return window;
}

export function highlightSelectedText(selection: Selection): HTMLElement | null {
    const range = selection.getRangeAt(0);

    const highlight = document.createElement('span');
    highlight.style.backgroundColor = 'yellow';
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

      const scrollableParent: HTMLElement | Window = findScrollableParent(highlight);
      scrollableParent.addEventListener('scroll', updateTextBoxPosition);
      window.addEventListener('scroll', updateTextBoxPosition);

    return textBox;
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
