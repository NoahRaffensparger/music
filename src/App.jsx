import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Post from './pages/Post';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <div className='relative'>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new-post/*" element={<Post />} />
            <Route path="/profile/user/*" element={<Profile />} />
          </Routes>
          <Footer />
        </Router>
      </div>

    </>
  )
}

export default App
