export type Comment = {
  url: string;
  pathsToTextNode: string[];
  startOffset: number;
  endOffset: number;
  commentText: string;
  selectedText: string;
};

export type ApiRequestInfo = {
  url: string;
  method: string;
  body: any;
}