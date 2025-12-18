import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import EditProfile from './pages/EditProfile';
import Followers from './pages/Followers';
import Social from './pages/Social';
import Post from './pages/Post';
import Posts from './pages/Posts';
import User from './pages/User';
import Track from './pages/Track';
import Artist from './pages/Artist';
import Album from './pages/Album';
import Playlist from './pages/Playlist';
import Header from './components/Header';
import Footer from './components/Footer';
import UserContext from "./components/UserContext";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = async (email, password) => {
    const res = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    console.log(data)
    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } else {
      alert("Login failed");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (loading) {
    return (
      <div className='w-screen flex justify-center mt-12'>
        <img src='/loading.png' className="h-[28px] animate-spin px-auto"></img>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mt-22 mx-4">
        <p>Login</p>
        <form
          className="flex gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(email, pass);
          }}
        >
          <p>Email</p>
          <textarea className="w-full py-1 bg-white" value={email} onChange={(e) => setEmail(e.target.value)}></textarea>
          <p>Password</p>
          <textarea className="w-full py-1 bg-white" value={pass} onChange={(e) => setPass(e.target.value)}></textarea>
          <button type='submit' className="border-1">Log in</button>
        </form>
      </div>
    )
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className='relative'>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit" element={<EditProfile />} />
          <Route path="/followers" element={<Followers />} />
          <Route path="/profile/:id" element={<User />} />
          <Route path="/new-log" element={<Post />} />
          <Route path="/new-playlist" element={<Playlist />} />
          <Route path="/social/*" element={<Social />} />
          <Route path="/post/*" element={<Posts />} />
          <Route path="/song/*" element={<Track />} />
          <Route path="/artist/*" element={<Artist />} />
          <Route path="/album/*" element={<Album />} />
        </Routes>
        <Footer />
      </div>
    </UserContext.Provider>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
