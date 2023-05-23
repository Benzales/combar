import React, { useEffect, useState } from 'react';
import { Url, Comment } from './types'
import { CommentContainer, CommentBox, CommentHeader, ProfilePic, UserName, CommentText } from './styles';

function App() {
  const [urlCommentsMap, setUrlCommentsMap] = useState<Record<string, Comment[]>>({});
  const [urlTitleMap, setUrlTitleMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUrlsAndComments = async () => {
      try {
        const urlRes = await fetch('http://localhost:5000/api/urls');
        const urls: Url[] = await urlRes.json();

        const commentsPromises = urls.map((url) =>
          fetch(`http://localhost:5000/api/urls/${encodeURIComponent(url.url)}/comments`)
        );
        const commentsRes = await Promise.all(commentsPromises);
        const commentsData = await Promise.all(commentsRes.map((res) => res.json()));

        const newUrlCommentsMap: Record<string, Comment[]> = {};
        const newUrlTitleMap: Record<string, string> = {};

        urls.forEach((url, index) => {
          newUrlCommentsMap[url.url] = commentsData[index];
          newUrlTitleMap[url.url] = url.title;
        });

        setUrlCommentsMap(newUrlCommentsMap);
        setUrlTitleMap(newUrlTitleMap);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUrlsAndComments();
  }, []);

  return (
    <div>
      <CommentContainer>
        <h1>Combar Hub</h1>
        {Object.keys(urlCommentsMap).map((url, index) => (
          <div key={index}>
            <a href={url} target="_blank" rel="noopener noreferrer">{urlTitleMap[url]}</a>

            <ul>
              {urlCommentsMap[url].map((comment) => (
                <CommentBox
                  key={index}
                >
                  <CommentHeader>
                    <ProfilePic />
                    <UserName>{"Ben Gonzales"}</UserName>
                  </CommentHeader>
                  <CommentText>{comment.commentText}</CommentText>
                </CommentBox>
              ))}
            </ul>
          </div>
        ))}
      </CommentContainer>
    </div>
  );
}

export default App;
