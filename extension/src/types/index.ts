export type Comment = {
  url: string;
  pathToCommonAncestor: string;
  startOffset: number;
  endOffset: number;
  commentText: string;
  selectedText: string;
  username: string;
  id: number;
  replies: Reply[];
  votes: number;
};

export type Reply = {
  id: number;
  replyText: string;
  username: string;
  votes: number;
}
export type ApiRequestInfo = {
  url: string;
  method: string;
  body: any;
}