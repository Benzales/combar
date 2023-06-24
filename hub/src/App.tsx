import React, { createContext, useEffect, useState } from 'react';
import Header from "./Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { About } from "./About";
import CommentLoader from "./CommentLoader";
import { User } from "./types";
import Footer from './Footer';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = React.createContext<UserContextType>({
  user: null,
  setUser: () => {},
});
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.from === 'content' && request.message === 'REQUEST_TOKENS') {
//     // replace with your actual logic to retrieve tokens
//     let accessToken = localStorage.getItem('accessToken');
//     let refreshToken = localStorage.getItem('refreshToken');
    
//     // Send tokens back to the extension
//     if(accessToken && refreshToken) sendResponse({accessToken: accessToken, refreshToken: refreshToken});
//     else sendResponse(null);
//   }
// });

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    window.addEventListener('message', function(event) {
      // We only accept messages from ourselves
      if (event.source !== window) return;
  
      if (event.data.type && (event.data.type === "FROM_CONTENT_SCRIPT")) {
        console.log("Content script has sent a message: " + event.data.text);
  
        // Send a response back to the content script
        let accessToken = localStorage.getItem('accessToken');
        let refreshToken = localStorage.getItem('refreshToken');
        window.postMessage({ type: "FROM_PAGE", accessToken: accessToken, refreshToken: refreshToken }, "*");
      }
    }, false);
  }, []);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<CommentLoader />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/notifications" element={} */}
        </Routes>
        <Footer />
      </Router>
    </UserContext.Provider>
  );
}

export { UserContext, App as default };
