import Header from './Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { About } from './About';
import CommentLoader from './CommentLoader';
import Profile from './Profile';

function App() {

  return (
    <Router>
      <Header />
      <Profile />
      <Routes>
        <Route path="/" element={<CommentLoader />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
