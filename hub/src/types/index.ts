export type Url = {
  id: number;
  url: string;
  title: string;
}
export type Comment = {
  id: string;
  url: string;
  pathsToTextNode: string[];
  startOffset: number;
  endOffset: number;
  commentText: string;
  selectedText: string;
  username: string;
};

export type ApiRequestInfo = {
  url: string;
  method: string;
  body: any;
}