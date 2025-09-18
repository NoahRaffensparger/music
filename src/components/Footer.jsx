import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

export default function Footer() {
    const currentPage = useLocation().pathname;
    const newPostMenuRef = useRef();
    const [isNewPostMenuOpen, setIsNewPostMenuOpen] = useState(false);

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
                <div className={`flex justify-center transition-all duration-300 z-0 ${isNewPostMenuOpen ? 'h-[136px]' : 'h-0'}`}>
                    <div className={`flex flex-col items-center gap-2 pt-2 bg-white w-1/2 rounded-t-xl transition-all duration-300 ${isNewPostMenuOpen ? '' : 'translate-y-96'}`}>
                        <Link to='/new-post/song' className={`font-medium transition-all ${isNewPostMenuOpen ? 'opacity-100 duration-600' : 'opacity-0 duration-0'}`}>log new song</Link>
                        <Link to='/new-post/artist' className={`font-medium transition-all ${isNewPostMenuOpen ? 'opacity-100 duration-600' : 'opacity-0 duration-0'}`}>log new artist</Link>
                        <Link to='/new-post/album' className={`font-medium transition-all ${isNewPostMenuOpen ? 'opacity-100 duration-600' : 'opacity-0 duration-0'}`}>log new album</Link>
                        <Link to='/new-post/playlist' className={`font-medium transition-all ${isNewPostMenuOpen ? 'opacity-100 duration-600' : 'opacity-0 duration-0'}`}>create new playlist</Link>
                    </div>
                </div>
                <nav className='flex flex-col w-screen bg-white z-10'>

                    <div className='py-3 flex justify-around px-4'>

                        <Link to='/'>
                            <img src={`${currentPage === '/' ? '/filled-home.png' : '/home.png'}`} className='h-7'></img>
                        </Link>
                        <img ref={newPostMenuRef} onClick={handleNewPostIconClick} src={`${currentPage.startsWith('/new-post/') || isNewPostMenuOpen ? '/filled-plus.png' : '/plus.png'}`} className='h-7 w-auto' ></img>
                        <Link to='/profile/user/log' className='flex flex-row gap-2'>
                            <img src='/profile-ben.jpg' className={`h-7 w-7 rounded-full ${currentPage.startsWith('/profile/user/') ? 'border-[2px] border-black' : ''}`}></img>
                        </Link>
                    </div>

                </nav>
            </div>
        </>

    );
}
