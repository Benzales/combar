import { showComments, createTextBox } from "./commentLoader";
import { selectText } from '../textSelector';
import { Comment } from '../../types'; 
import { getTextBoxStyle } from "../../styles";

// create container for all text boxes
const shadowHost = document.createElement('div');
document.body.appendChild(shadowHost);
const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

const textBoxContainer = document.createElement("div");
textBoxContainer.classList.add("combar-text-box-container");
shadowRoot.appendChild(textBoxContainer);

showComments(textBoxContainer);

const handleMouseUp = async () => {
  const selection = window.getSelection();
  if (selection && selection.toString().length > 0) {
    document.removeEventListener("mouseup", handleMouseUp);
    const newComment: Comment | undefined = await selectText(selection);
    
    if(newComment) {
      const textBox: HTMLTextAreaElement = createTextBox(newComment);
      textBoxContainer.appendChild(textBox);

      // Capture the input when the user is done editing
      textBox.addEventListener("blur", () => {
        console.log("User input:", textBox.value);
        newComment.commentText = textBox.value;
        const apiRequestInfo = {
          url: "/api/comments",
          method: "POST",
          body: newComment,
        }
        chrome.runtime.sendMessage({ action: 'apiRequest', apiRequestInfo: apiRequestInfo }, (response) => {
          if(response.error) console.error(response.error); 
        });
      });
    }
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'select-text') {
    document.addEventListener("mouseup", handleMouseUp);
  }
});
