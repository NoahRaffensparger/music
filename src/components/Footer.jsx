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
                <nav className='flex flex-col w-screen bg-white z-10'>
                    <div className='py-3 flex justify-around px-4'>
                        <Link to={`/`} className='flex flex-row gap-2'>
                            <img src={user.image_url} className='h-7 w-7 rounded-full' />
                        </Link>
                        <Link to='/new-log'>
                            <img src={`${currentPage === '/new-log' ? '/filled-plus.png' : '/plus.png'}`} className='h-7 w-auto' />
                        </Link>
                        <Link to='/social'>
                            <img src={`${currentPage === '/' ? '/pulse.png' : '/pulse.png'}`} className='h-7'></img>
                        </Link>
                    </div>

                </nav>
            </div>
        </>

    );
}
