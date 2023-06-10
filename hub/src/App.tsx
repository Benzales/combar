import React, { createContext, useState } from 'react';
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

function App() {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<CommentLoader />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </Router>
    </UserContext.Provider>
  );
}

export { UserContext, App as default };
