import { useState, useRef, useEffect, useContext } from 'react';
import UserContext from "../components/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Star } from "lucide-react";

export default function Post() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [songSelect, setSongSelect] = useState(0);
    const [advancedSettings, setAdvancedSettings] = useState(0);
    const [commentsEnabled, setCommentsEnabled] = useState(false);
    const [reviewVisible, setReviewVisible] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const location = useLocation();
    const searchRef = useRef(null);
    const [query, setQuery] = useState("");
    const [trackAndArtistResults, setTrackAndArtistResults] = useState([]);
    const [caption, setCaption] = useState(null);
    const [albumResults, setAlbumResults] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const { track } = location.state || {};
    const [selectedMusic, setSelectedMusic] = useState({
        image: '',
        artists: '',
        name: '',
        href: '',
        type: ''
    });


    const API_URL = "http://localhost:3001/api/search";

    const handleSongSelection = () => {
        setSongSelect(true);
    };

    const handleGoBack = () => {
        setSongSelect(false);
    };

    const handleAdvancedSettings = () => {
        setAdvancedSettings(prev => !prev);
    };

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
                console.log(data);
            } catch (err) {
                console.error(err);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [query]);

    useEffect(() => {
        if (location.state?.track) {
            fetchTrack(location.state.track);
        } else if (location.state?.artist) {
            fetchArtist(location.state.artist);
        } else if (location.state?.album) {
            fetchAlbum(location.state.album);
        }
    }, [location.state]);

    useEffect(() => {
        if (isSearchOpen && searchRef.current) {
            setTimeout(() => {
                searchRef.current.focus();
            }, 0);
        }
    }, [isSearchOpen]);

    const fetchTrack = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/api/track/${id}`);
            const data = await res.json();
            const href = id
            const trackInfo = {
                image: data.album.images[0].url,
                name: data.name,
                artists: data.artists.map(a => a.name).join(", "),
                href: href,
                type: "song"
            }
            console.log('hit')
            setSelectedMusic(trackInfo);
            handleSongSelection()
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };
    const fetchArtist = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/api/artist/${id}`);
            const data = await res.json();
            const href = id
            const artistInfo = {
                image: data.images[0].url,
                name: data.name,
                href: href,
                type: "artist"
            }
            console.log(artistInfo)
            setSelectedMusic(artistInfo);
            handleSongSelection()
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };
    const fetchAlbum = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/api/album/${id}`);
            const data = await res.json();
            const href = id
            const albumInfo = {
                image: data.images[0].url,
                name: data.name,
                artists: data.artists.map(a => a.name).join(", "),
                href: href,
                type: "album"
            }
            console.log(albumInfo)
            setSelectedMusic(albumInfo);
            handleSongSelection()
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const uploadPost = async (user_id, type, music_id, caption, rating, title, artist, image_url) => {
        try {
            const res = await fetch(`http://localhost:3001/api/add-post`, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({ user_id, type, music_id, caption, rating, title, artist, image_url }),
            });

            const data = await res.json();
            console.log("post upload success", data);
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        <>
            <div className="mt-16 mx-3">
                <button className={`${songSelect ? 'mb-4 font-medium visible' : 'hidden pointer-events-none'}`} onClick={() => { handleGoBack() }}>{`< go back`}</button>
                <div className={`pb-3 ${songSelect ? 'hidden pointer-events-none' : 'visible'}`}>
                    <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} name='search' placeholder="search songs" className="bg-gray-300 w-full py-1 px-2">
                    </input>
                    <div className="bg-gray-200 border-gray-400 rounded-b-xl">
                        {
                            trackAndArtistResults.length > 0 && (
                                <ul className="">
                                    {trackAndArtistResults.map((trackAndArtistResults, i) => (
                                        <li key={i}
                                            className="flex items-center p-2 gap-3"
                                            onClick={() => {

                                                if (trackAndArtistResults.type === "song") {
                                                    const trackId = trackAndArtistResults.href.split("/").pop();
                                                    fetchTrack(trackId);
                                                } else if (trackAndArtistResults.type === "artist") {
                                                    const artistId = trackAndArtistResults.href.split("/").pop();
                                                    fetchArtist(artistId);
                                                }
                                                setQuery('')
                                            }}>
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
                                        </li>
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
                                        <li key={i} onClick={() => {
                                            const albumId = albumResults.href.split("/").pop();
                                            fetchAlbum(albumId);
                                            setQuery('')
                                        }} className="flex items-center p-2 gap-3">
                                            <img
                                                src={albumResults.image}
                                                alt={albumResults.name}
                                                className="w-12 h-12"
                                            />
                                            <div>
                                                <p className="font-semibold">{albumResults.name}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )
                        }
                    </div>

                </div>
                <div className={`flex gap-2 items-center pb-3 ${songSelect ? 'visible' : 'hidden pointer-events-none'}`}>
                    <img src={selectedMusic.image} className="h-14 rounded-xl"></img>
                    <div>
                        <p className="font-bold text-lg">{selectedMusic.name}</p>
                        <p className="text-black/70 font-medium">{selectedMusic.artists}</p>
                    </div>
                </div>

                <div className={`flex gap-2 pt-2 ${songSelect ? 'visible' : 'hidden pointer-events-none'}`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className="focus:outline-none"
                        >
                            <Star
                                size={32}
                                className={`transition-all duration-100 cursor-pointer font-light ${(hover || rating) >= star ? "fill-yellow-400 text-gray-200" : "text-gray-300"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
                <textarea placeholder="comments" className={`border-1 rounded-xl border-gray-300 w-full mt-4 px-2 py-1 h-30 focus:outline-none focus:ring-0 ${songSelect ? 'visible' : 'hidden pointer-events-none'}`} value={caption} onChange={(e) => setCaption(e.target.value)}></textarea>

                <button onClick={handleAdvancedSettings} className={`flex items-center gap-[2px] ${songSelect ? 'visible' : 'hidden pointer-events-none'}`}>
                    <p className="font-medium">advanced settings</p>
                    <img src={`${advancedSettings ? '/up-arrow.png' : '/down-arrow.png'}`} className="h-5 w-4 pt-[2px]"></img>
                </button>

                <div className={`flex flex-col gap-2 mt-2 ${advancedSettings ? 'visible' : 'hidden pointer-events-none'}`}>
                    <div className="flex gap-2">
                        <p>comments off</p>
                        <div onClick={() => setCommentsEnabled(prev => !prev)} className={`w-12 h-6 flex items-center rounded-full cursor-pointer border-1 border-gray-300 duration-125 p-[1px] ${commentsEnabled ? "bg-white p-[2px]" : "bg-gray-600 p-[1px]"}`}>
                            <div className={` rounded-full shadow-md transform transition-transform duration-125 ${commentsEnabled ? "translate-x-[25px] w-[15px] h-[15px] bg-gray-500 " : "translate-x-[3px] w-[15px] h-[15px] bg-gray-200 "}`} />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <p>hide rating</p>
                        <div onClick={() => setReviewVisible(prev => !prev)} className={`w-12 h-6 flex items-center rounded-full cursor-pointer border-1 border-gray-300 duration-125 p-[1px] ${reviewVisible ? "bg-white p-[2px]" : "bg-gray-600 p-[1px]"}`}>
                            <div className={` rounded-full shadow-md transform transition-transform duration-125 ${reviewVisible ? "translate-x-[25px] w-[15px] h-[15px] bg-gray-500 " : "translate-x-[3px] w-[15px] h-[15px] bg-gray-200 "}`} />
                        </div>
                    </div>
                </div>

                <button className={`bg-gray-400 px-3 py-1 rounded-lg font-medium mt-2 ${songSelect ? 'visible' : 'hidden pointer-events-none'}`} onClick={async () => {
                    await uploadPost(user.userId, selectedMusic.type, selectedMusic.href, caption, rating, selectedMusic.name, selectedMusic.artists, selectedMusic.image);
                    navigate("/");
                }}>
                    post
                </button>
            </div>
        </>
    );
}
