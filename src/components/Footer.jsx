import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect, useContext } from 'react';
import UserContext from "../components/UserContext";

export default function Footer() {
    const currentPage = useLocation().pathname;
    const newPostMenuRef = useRef();
    const [isNewPostMenuOpen, setIsNewPostMenuOpen] = useState(false);
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        function handleClickOutside(event) {
            if (newPostMenuRef.current && !newPostMenuRef.current.contains(event.target)) {
                setIsNewPostMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNewPostIconClick = () => {
        setIsNewPostMenuOpen(prev => !prev);
    };
    
    return (
        <>
            <div className='fixed bottom-0'>
                <div className={`flex justify-center transition-all duration-300 z-0 ${isNewPostMenuOpen ? 'h-[70px]' : 'h-0'}`}>
                    <div className={`flex flex-col items-center gap-2 pt-2 bg-white w-1/2 rounded-t-xl transition-all duration-300 ${isNewPostMenuOpen ? '' : 'translate-y-96'}`}>
                        <Link to='/new-log' className={`font-medium transition-all ${isNewPostMenuOpen ? 'opacity-100 duration-600' : 'opacity-0 duration-0'}`}>log new music</Link>
                        <Link to='/new-playlist' className={`font-medium transition-all ${isNewPostMenuOpen ? 'opacity-100 duration-600' : 'opacity-0 duration-0'}`}>create new playlist</Link>
                    </div>
                </div>
                <nav className='flex flex-col w-screen bg-white z-10'>

                    <div className='py-3 flex justify-around px-4'>
                        <Link to={`/`} className='flex flex-row gap-2'>
                            <img src={user.image_url} className='h-7 w-7 rounded-full' />
                        </Link>
                        <img ref={newPostMenuRef} onClick={handleNewPostIconClick} src={`${currentPage.startsWith('/new-post/') || isNewPostMenuOpen ? '/filled-plus.png' : '/plus.png'}`} className='h-7 w-auto' ></img>
                        <Link to='/social'>
                            <img src={`${currentPage === '/' ? '/pulse.png' : '/pulse.png'}`} className='h-7'></img>
                        </Link>
                    </div>

                </nav>
            </div>
        </>

    );
}
