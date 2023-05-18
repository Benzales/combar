import React from 'react';
import ReactDOM from 'react-dom';
import Combar from "./Combar";
import { selectText } from './textSelector';
import { Comment } from '../types';

const rootElement = document.createElement('div');
rootElement.id = 'my-extension-root';
document.body.appendChild(rootElement);

ReactDOM.render(<Combar />, rootElement);

const handleMouseUp = async () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
        document.removeEventListener("mouseup", handleMouseUp);
        const newComment: Comment | undefined = await selectText(selection);

        if (newComment) {

            // Capture the input when the user is done editing
            // textBox.addEventListener("blur", () => {
            //   console.log("User input:", textBox.value);
            //   newComment.commentText = textBox.value;
            const apiRequestInfo = {
                url: "/api/comments",
                method: "POST",
                body: newComment,
            }
            chrome.runtime.sendMessage({ action: 'apiRequest', apiRequestInfo: apiRequestInfo }, (response) => {
                if (response.error) console.error(response.error);
            });
            // });
        }
    }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'select-text') {
        document.addEventListener("mouseup", handleMouseUp);
    }
});