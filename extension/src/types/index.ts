export type Comment = {
  url: string;
  pathToCommonAncestor: string;
  startOffset: number;
  endOffset: number;
  commentText: string;
  selectedText: string;
  username: string;
  id: number;
};

export type Reply = {
  replyText: string;
  username: string;
}
export type ApiRequestInfo = {
  url: string;
  method: string;
  body: any;
}