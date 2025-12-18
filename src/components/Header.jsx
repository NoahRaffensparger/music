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
    const [query, setQuery] = useState("");
    const [trackAndArtistResults, setTrackAndArtistResults] = useState([]);
    const [albumResults, setAlbumResults] = useState([]);

    const API_URL = "http://localhost:3001/api/search";

    useEffect(() => {
        if (query.length < 2) {
            setTrackAndArtistResults([]);
            setAlbumResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setTrackAndArtistResults(data.results);
                setAlbumResults(data.albums);
            } catch (err) {
                console.error(err);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [query]);


    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsSearchOpen(false);
                setIsMenuOpen(false);
                setQuery('');
                setTrackAndArtistResults([]);
                setAlbumResults([]);

            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchIconClick = () => {
        setIsMenuOpen(false)
        setIsSearchOpen(prev => !prev);
        setTrackAndArtistResults([]);
        setAlbumResults([]);
        setQuery('');
    };
    const handleMenuIconClick = () => {
        setIsSearchOpen(false)
        setIsMenuOpen(prev => !prev);
        setTrackAndArtistResults([]);
        setAlbumResults([]);
        setQuery('');
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
            <nav className='absolute py-2 z-5 flex flex-col fixed top-0 w-screen bg-white border-b-1 border-gray-200' ref={dropdownRef}>
                <div className='flex justify-between'>
                    <Link to="/" className='place-content-center flex gap-2'>
                        <img src="/etta.png" className="ml-2 h-7 md:h-8" />
                    </Link>
                    <div className='flex flex-row items-center'>
                        <img onClick={handleSearchIconClick} src="/search.png" className='h-5 pr-2 cursor-pointer'></img>
                        <img onClick={handleMenuIconClick} src="/black-dots.png" className='h-5 pr-2 cursor-pointer'></img>
                    </div>
                </div>

                <div>
                    <form className={`transition-all sm:transition-none w-screen sm:w-1/2 px-4 sm:px-0 sm:fixed sm:top-[8px] sm:right-16 sm:origin-right ${isSearchOpen ? 'h-[40px] mt-4 sm:mt-0 duration-300 sm:duration-0 sm:visible' : 'h-0 sm:h-[40px] invisible pointer-events-none duration-300 sm:duration-0'}`}>
                        <input name="search" placeholder='search music' ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} className={`bg-gray-300 w-full py-1 px-3 sm:px-0 rounded-md focus:outline-none focus:ring-0 sm:transition-all sm:duration-500 sm:origin-right ${isSearchOpen ? 'opacity-100 duration-500 sm:scale-x-100 sm:px-2' : 'sm:scale-x-0 sm:px-0 opacity-0 sm:opacity-100 duration-100 sm:duration-500'}`}>
                        </input>
                    </form>
                    {
                        trackAndArtistResults.length > 0 && (
                            <ul className="mt-1">
                                {trackAndArtistResults.map((trackAndArtistResults, i) => (
                                    <Link to={`/${trackAndArtistResults.type}/${trackAndArtistResults.href.split("/").pop()}`} key={i} className="flex items-center p-2 gap-3" onClick={() => handleSearchIconClick()}>
                                        <img
                                            src={trackAndArtistResults.image}
                                            alt={trackAndArtistResults.name}
                                            className="w-12 h-12 rounded"
                                        />
                                        <div className='flex flex-row justify-between w-full h-[44px]'>
                                            <div className='flex flex-col justify-center'>
                                                <p className="font-semibold">{trackAndArtistResults.name}</p>
                                                {trackAndArtistResults.artists && (
                                                    <p className="text-sm text-gray-500">{trackAndArtistResults.artists}</p>
                                                )}
                                            </div>

                                            <div className='flex items-end'>
                                                <p className="text-sm text-gray-600">
                                                    {trackAndArtistResults.type}
                                                </p>
                                            </div>


                                        </div>
                                    </Link>
                                ))}
                            </ul>
                        )
                    }                    {
                        trackAndArtistResults.length > 0 && (
                            <p className='mt-2 ml-2 font-bold text-black/80'>Albums</p>
                        )
                    }

                    {
                        albumResults.length > 0 && (
                            <ul className="">
                                {albumResults.map((albumResults, i) => (
                                    <Link to={`/album/${albumResults.href.split("/").pop()}`} key={i} className="flex items-center p-2 gap-3" onClick={() => handleSearchIconClick()}>
                                        <img
                                            src={albumResults.image}
                                            alt={albumResults.name}
                                            className="w-12 h-12"
                                        />
                                        <div>
                                            <p className="font-semibold">{albumResults.name}</p>
                                        </div>
                                    </Link>
                                ))}
                            </ul>
                        )
                    }
                </div >

                <div className={`flex flex-col text-center font-semibold gap-4 transition-all duration-300 sm:w-1/2 lg:w-1/3 sm:fixed sm:bg-white sm:top-10 sm:right-0 sm:border-b sm:rounded-b-xl ${isMenuOpen ? 'h-[84px]  sm:h-[136px] pt-4 mt-2 border-t-2 border-gray-200 sm:pb-4 ' : 'h-0 pointer-events-none border-white'}`}>
                    {/* <div className={`flex place-self-center gap-2 transition-all ${isMenuOpen ? 'opacity-100 duration-300' : 'opacity-0 duration-100'}`}>
                        <p>appearance</p>
                        <div onClick={() => setEnabled(prev => !prev)} className={`w-12 h-6 flex items-center rounded-full cursor-pointer transition-colors border-1 border-gray-400 ${enabled ? "bg-gray-900 p-[1px]" : "bg-white p-[2px]"}`}>
                            <img className={` rounded-full shadow-md transform transition-transform ${enabled ? "bg-white translate-x-[25px] w-[18px] h-[18px]" : "translate-x-0 w-5 h-5"}`} src={` ${enabled ? "/moon.png" : "/sun.png"}`} />
                        </div>
                    </div> */}
                    <a className={`transition-all ${isMenuOpen ? 'opacity-100 duration-400' : 'opacity-0 duration-100'}`}>log out</a>
                    <a className={`transition-all text-red-600 ${isMenuOpen ? 'opacity-100 duration-600' : 'opacity-0 duration-100'}`}>delete account</a>
                </div>

            </nav>
        </>
    );
}
