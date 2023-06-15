import React from 'react';
import { ApiRequestInfo } from '../types';

enum VoteValue {
  UPVOTE = 1,
  DOWNVOTE = -1,
}

enum CommentType {
  COMMENT = "comments",
  REPLY = "replies",
}

interface CommentVoterProps {
  id: number;
  votes: number;
}

const CommentVoter: React.FC<CommentVoterProps> = ({ id, votes }) => {
  const vote = (voteValue: VoteValue, commentType: CommentType) => {
    const apiRequestInfo: ApiRequestInfo = {
      url: "/api/" + commentType + "/" + id + "/vote",
      method: "POST",
      body: {"vote": voteValue},
    }
    chrome.runtime.sendMessage({ action: 'apiRequest', apiRequestInfo: apiRequestInfo }, (response) => {
      if (response.error) console.error(response.error);
      else votes++;
    });
  }

  return (
    <>
      <p> Vote Count: {votes} </p>
      <button onClick={() => vote(VoteValue.UPVOTE, CommentType.COMMENT)}> Upvote </button>
      <button onClick={() => vote(VoteValue.DOWNVOTE, CommentType.COMMENT)}> Downvote </button>
    </>
  )
}

export default CommentVoter;