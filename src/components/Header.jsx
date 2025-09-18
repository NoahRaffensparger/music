import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import '@lottiefiles/lottie-player';

export default function Header() {
    const currentPage = useLocation().pathname;
    const dropdownRef = useRef();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const searchRef = useRef(null);
    const [enabled, setEnabled] = useState(false);


    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsSearchOpen(false);
                setIsMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchIconClick = () => {
        setIsMenuOpen(false)
        setIsSearchOpen(prev => !prev);
    };
    const handleMenuIconClick = () => {
        setIsSearchOpen(false)
        setIsMenuOpen(prev => !prev);
    };

    useEffect(() => {
        if (isSearchOpen && searchRef.current) {
            setTimeout(() => {
                searchRef.current.focus();
            }, 0);
        }
    }, [isSearchOpen]);

    return (
        <>
            <nav className='absolute py-2 z-5 flex flex-col fixed top-0 w-screen bg-white border-b-1 border-gray-200 rounded-b-lg' ref={dropdownRef}>
                <div className='flex justify-between'>
                    <Link to="/" className='place-content-center flex gap-2'>
                        <img src="/instagram.png" className="ml-2 h-8 md:h-8" />
                        <p className='flex items-center text-xl font-semibold'>app-name</p>
                    </Link>
                    <div className='flex flex-row items-center'>
                        <img onClick={handleSearchIconClick} src="/search.png" className='h-5 pr-2 cursor-pointer'></img>
                        <img onClick={handleMenuIconClick} src="/black-dots.png" className='h-5 pr-2 cursor-pointer'></img>
                    </div>
                </div>

                <form className={`transition-all sm:transition-none w-screen sm:w-1/2 px-4 sm:px-0 sm:fixed sm:top-[8px] sm:right-16 sm:origin-right ${isSearchOpen ? 'h-[40px] mt-4 sm:mt-0 duration-300 sm:duration-0 sm:visible' : 'h-0 sm:h-[40px] invisible pointer-events-none duration-300 sm:duration-0'}`}>
                    <input name="search" placeholder='search' ref={searchRef} className={`bg-gray-300 w-full py-1 px-3 sm:px-0 rounded-md focus:outline-none focus:ring-0 sm:transition-all sm:duration-500 sm:origin-right ${isSearchOpen ? 'opacity-100 duration-500 sm:scale-x-100 sm:px-2' : 'sm:scale-x-0 sm:px-0 opacity-0 sm:opacity-100 duration-100 sm:duration-500'}`}>
                    </input>
                </form>

                <div className={`flex flex-col text-center font-semibold gap-4 transition-all duration-300 sm:w-1/2 lg:w-1/3 sm:fixed sm:bg-white sm:top-10 sm:right-0 sm:border-b sm:rounded-b-xl ${isMenuOpen ? 'h-[124px]  sm:h-[136px] pt-4 mt-2 border-t-2 border-gray-200 sm:pb-4 ' : 'h-0 pointer-events-none border-white'}`}>
                    <div className={`flex place-self-center gap-2 transition-all ${isMenuOpen ? 'opacity-100 duration-300' : 'opacity-0 duration-100'}`}>
                        <p>appearance</p>
                        <div onClick={() => setEnabled(prev => !prev)} className={`w-12 h-6 flex items-center rounded-full cursor-pointer transition-colors border-1 border-gray-400 ${enabled ? "bg-gray-900 p-[1px]" : "bg-white p-[2px]"}`}>
                            <img className={` rounded-full shadow-md transform transition-transform ${enabled ? "bg-white translate-x-[25px] w-[18px] h-[18px]" : "translate-x-0 w-5 h-5"}`} src={` ${enabled ? "/moon.png" : "/sun.png"}`} />
                        </div>
                    </div>
                    <a className={`transition-all ${isMenuOpen ? 'opacity-100 duration-400' : 'opacity-0 duration-100'}`}>log out</a>
                    <a className={`transition-all text-red-600 ${isMenuOpen ? 'opacity-100 duration-600' : 'opacity-0 duration-100'}`}>delete account</a>
                </div>

            </nav>
        </>
    );
}
