import React, { useEffect, useContext, useState } from 'react';
import { IsPostingContext } from './Combar';
import { selectText } from './textSelector';
import { Comment } from '../types';

const CommentPoster: React.FC = () => {
    const isPostingContext = useContext(IsPostingContext);
    if (!isPostingContext) {
        throw new Error('CommentPoster must be used within an IsPostingContext provider');
    }
    const [isPosting, setIsPosting] = isPostingContext;
    const [newComment, setNewComment] = useState<Comment | undefined>(undefined);
    const [userInput, setUserInput] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const updatedComment = {
            ...newComment,
            commentText: userInput, 
        };
        const apiRequestInfo = {
            url: "/api/comments",
            method: "POST",
            body: updatedComment,
        }
        chrome.runtime.sendMessage({ action: 'apiRequest', apiRequestInfo: apiRequestInfo }, (response) => {
            if (response.error) console.error(response.error);
            setUserInput('');
            setIsPosting(false);
        });
    };

    const handleMouseUp = async () => {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
            document.removeEventListener("mouseup", handleMouseUp);
            const _newComment: Comment | undefined = await selectText(selection);
            if (_newComment) {
                setNewComment(_newComment);
                setIsPosting(true);
            }
        }
    }

    useEffect(() => {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'select-text') {
                document.addEventListener("mouseup", handleMouseUp);
            }
        });
    }, []);

    return (
        <div>
            {isPosting &&
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Type your comment..."
                        value={userInput}
                        onChange={handleInputChange}
                    />
                    <button type="submit">Submit</button>
                </form>
            }
        </div>
    )
};

export default CommentPoster;