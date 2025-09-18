import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Songs from './profile-pages/Songs';
import Albums from './profile-pages/Albums';
import Playlists from './profile-pages/Playlists';
import Artists from './profile-pages/Artists';
import Logs from './profile-pages/Logs';

export default function Profile() {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef();
    const currentPage = useLocation().pathname;

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleProfileMenuClick = () => {
        setIsProfileMenuOpen(prev => !prev);
    };

    return (
        <>
            <div className="mt-11 relative bg-cover bg-center h-38" style={{ backgroundImage: "url('/daniel.jpg')" }}>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative flex px-6 gap-4 items-center h-full sm:max-w-4/5 sm:mx-auto sm:px-0">
                    <img
                        src="/daniel-album.jpg"
                        className="h-20 w-auto rounded-xl"
                    />
                    <div>
                        <h2 className="font-medium text-white text-lg">Japanese Denim</h2>
                        <p className="text-gray-200">Daniel Caesar</p>
                    </div>
                </div>
            </div>
            <div className="mx-2">
                <div className="py-4 flex justify-between items-center sm:max-w-4/5 sm:mx-auto">
                    <div className="flex gap-2">
                        <Link to="/profile/user/posts">
                            <img src="/profile-ben.jpg" className="h-12 w-12 rounded-full"></img>
                        </Link>
                        <div className="leading-none">
                            <h3 className="text-xl font-medium text-black/90">ben carson</h3>
                            <p className="text-sm font-semibold text-black/80">sound collector</p>
                        </div>
                    </div>
                    <div ref={profileMenuRef} className='relative'>
                        <img onClick={handleProfileMenuClick} src="/black-dots.png" className="h-5 pr-2 z-50"></img>
                        <div className={`top-6 z-0 absolute right-0 px-3 flex flex-col gap-3 w-26 bg-white rounded-xl transition-all duration-250 ${isProfileMenuOpen ? 'h-[190px] pb-2 pt-3 border-gray-300 border-1' : 'h-0 pointer-events-none'}`}>
                            <a className={`transition-all ${isProfileMenuOpen ? 'opacity-100 duration-100' : 'opacity-0'}`}>edit profile</a>
                            <a className={`transition-all ${isProfileMenuOpen ? 'opacity-100 duration-400' : 'opacity-0'}`}>followers</a>
                            <a className={`transition-all ${isProfileMenuOpen ? 'opacity-100 duration-400' : 'opacity-0'}`}>following</a>
                            <a className={`transition-all ${isProfileMenuOpen ? 'opacity-100 duration-700' : 'opacity-0'}`}>liked posts</a>
                            <a className={`transition-all ${isProfileMenuOpen ? 'opacity-100 duration-700' : 'opacity-0'}`}>comments</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex justify-between mx-2 px-1 pb-4 border-gray-700 sm:max-w-2/3 sm:mx-auto '>
                <Link to='/profile/user/log' className={`font-medium text-md ${currentPage === '/profile/user/log' ? 'underline underline-offset-5 decoration-3 decoration-gray-700' : ''}`}>log</Link>
                <Link to='/profile/user/songs' className={`font-medium text-md ${currentPage === '/profile/user/songs' ? 'underline underline-offset-5 decoration-3 decoration-gray-700' : ''}`}>songs</Link>
                <Link to='/profile/user/artists' className={`font-medium text-md ${currentPage === '/profile/user/artists' ? 'underline underline-offset-5 decoration-3 decoration-gray-700' : ''}`}>artists</Link>
                <Link to='/profile/user/albums' className={`font-medium text-md ${currentPage === '/profile/user/albums' ? 'underline underline-offset-5 decoration-3 decoration-gray-700' : ''}`}>albums</Link>
                <Link to='/profile/user/playlists' className={`font-medium text-md ${currentPage === '/profile/user/playlists' ? 'underline underline-offset-5 decoration-3 decoration-gray-700' : ''}`}>playlists</Link>
            </div>

            <Routes>
                <Route path="/log" element={<Logs />} />
                <Route path="/songs" element={<Songs />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/albums" element={<Albums />} />
                <Route path="/playlists" element={<Playlists />} />
            </Routes>
        </>

    );
}
