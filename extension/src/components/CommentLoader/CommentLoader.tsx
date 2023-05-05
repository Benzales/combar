import React, { useEffect } from "react";
import { showComments } from './commentLoaderUtil';

const CommentLoader: React.FC = () => {
  useEffect(() => {
    showComments();
  }, []);
  return null;
};

export default CommentLoader;
