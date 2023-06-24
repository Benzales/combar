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

export type User = {
  id: string;
  name: string;
  email: string;
  bio: string;
  username: string;
}

export type ApiRequestInfo = {
  url: string;
  method: string;
  body: any;
}

export type Group = {
  id: string;
  groupName: string;
  members: User[];
  comments: Comment[];
}