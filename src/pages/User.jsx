import { Link, useLocation, useParams } from 'react-router-dom';
import { useState, useRef, useEffect, useContext } from 'react';
import UserContext from "../components/UserContext";

export default function User() {
    const { user, setUser } = useContext(UserContext);
    const { id } = useParams();
    const location = useLocation();
    const segments = location.pathname.split("/");
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [headerSong, setHeaderSong] = useState(null);
    const [following, setFollowing] = useState(false);
    const [headerSongArtist, setHeaderSongArtist] = useState(null);
    const [userInfo, setUserInfo] = useState(false);
    const [tab, setTab] = useState('log');
    const [isLoading, setIsLoading] = useState(true);
    const profileMenuRef = useRef();

    useEffect(() => {
        const fetchUserInfo = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`http://localhost:3001/api/user/${id}`);
                const data = await res.json();
                const userInfo = data.data[0];

                const posts = await Promise.all(
                    userInfo.posts.map(async (post) => {
                        let details = null;
                        if (post.type === "song") {
                            details = await fetchTrackInfo(post.music_id);
                        } else if (post.type === "album") {
                            details = await fetchAlbumInfo(post.music_id);
                        } else if (post.type === "artist") {
                            details = await fetchArtistInfo(post.music_id);
                        }
                        return { ...post, details };
                    })
                );

                const headerInfo = await fetchTrackInfo(userInfo.profile_song_href);
                setHeaderSong(headerInfo);

                const headerArtist = await fetchArtistInfo(headerInfo.artist_href);
                setHeaderSongArtist(headerArtist);

                setUserInfo(userInfo);
                setPosts(posts);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const followUser = async (user, isFollowing) => {
        try {
            const res = await fetch(`http://localhost:3001/api/follow-user`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: user,
                    isFollowing: isFollowing,
                }),
            });

            if (!res.ok) {
                throw new Error(`Failed to follow user: ${res.status}`);
            }

            const data = await res.json();
            console.log("user followed", data);
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const fetchTrackInfo = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/api/track/${id}`);
            if (!res.ok) throw new Error("Spotify track fetch failed");
            const data = await res.json()
            return {
                name: data.name,
                image: data.album?.images?.[0]?.url,
                artists: data.artists.map((artist) => artist.name).join(", "),
                url: data.external_urls?.spotify,
                artist_href: data.artists[0].href.split("/").pop()
            };
        } catch (err) {
            console.error("Error fetching track:", err);
            return null;
        }
    };

    const fetchAlbumInfo = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/api/album/${id}`);
            if (!res.ok) throw new Error("Spotify album fetch failed");
            const data = await res.json()
            return {
                name: data.name,
                image: data.images?.[0]?.url,
                artists: data.artists.map((artist) => artist.name).join(", "),
                url: data.external_urls?.spotify,
            };
        } catch (err) {
            console.error("Error fetching album:", err);
            return null;
        }
    };

    const fetchArtistInfo = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/api/artist/${id}`);
            if (!res.ok) throw new Error("Spotify artist fetch failed");
            const data = await res.json()
            return {
                name: data.name,
                image: data.images?.[0]?.url,
                url: data.external_urls?.spotify,
            };
        } catch (err) {
            console.error("Error fetching artist:", err);
            return null;
        }
    };

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

    const handleTabClick = (newValue) => {
        setTab(newValue);
    };

    function timeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return `${seconds} seconds ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minutes ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        const days = Math.floor(hours / 24);
        return `${days} days ago`;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }
    console.log(user)
    return (
        <>
            <div className="mt-11 relative bg-cover bg-center h-38" style={{ backgroundImage: `url(${headerSongArtist?.image})` }}>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative flex px-6 gap-4 items-center h-full sm:max-w-4/5 sm:mx-auto sm:px-0">
                    <img
                        src={headerSong?.image}
                        className="h-20 w-auto rounded-xl"
                    />
                    <div>
                        <h2 className="font-medium text-white text-lg">{headerSong?.name}</h2>
                        <p className="text-gray-200">{headerSong?.artists}</p>
                    </div>
                </div>
            </div>
            <div className="mx-2">
                <div className="py-4 flex justify-between items-center sm:max-w-4/5 sm:mx-auto">
                    <div className="flex gap-2">
                        <Link to="/profile/user/posts">
                            <img src={userInfo.image_url} className="h-12 w-12 rounded-full"></img>
                        </Link>
                        <div className="leading-none">
                            <h3 className="text-xl font-medium text-black/90">{`${userInfo.username}`}</h3>
                            <p className="text-sm font-semibold text-black/80">music maestro</p>
                        </div>
                    </div>
                    <button className='bg-gray-300 rounded-lg px-2 py-[2px] mr-2' onClick={() => followUser(user.userId, userInfo.user_id)}>
                        follow
                    </button>
                </div>
            </div>

            <div className='flex justify-between mx-2 px-1 pb-4 border-gray-700 sm:max-w-2/3 sm:mx-auto '>
                <a to='/profile/user/log' onClick={() => handleTabClick('log')} className={`font-medium text-md ${tab === 'log' ? 'underline underline-offset-5 decoration-3 decoration-gray-700' : ''}`}>log</a>
                <a to='/profile/user/songs' onClick={() => handleTabClick('songs')} className={`font-medium text-md ${tab === 'songs' ? 'underline underline-offset-5 decoration-3 decoration-gray-700' : ''}`}>songs</a>
                <a to='/profile/user/artists' onClick={() => handleTabClick('artists')} className={`font-medium text-md ${tab === 'artists' ? 'underline underline-offset-5 decoration-3 decoration-gray-700' : ''}`}>artists</a>
                <a to='/profile/user/albums' onClick={() => handleTabClick('albums')} className={`font-medium text-md ${tab === 'albums' ? 'underline underline-offset-5 decoration-3 decoration-gray-700' : ''}`}>albums</a>
                <a to='/profile/user/playlists' onClick={() => handleTabClick('playlists')} className={`font-medium text-md ${tab === 'playlists' ? 'underline underline-offset-5 decoration-3 decoration-gray-700' : ''}`}>playlists</a>
            </div>

            {posts.map((post) => (
                <div key={post.id} className="mx-2 sm:max-w-7/8 sm:mx-auto md:max-w-3/4 lg:max-w-5/8">
                    <div className="flex p-2 gap-2 border-t-2 border-gray-300">
                        <img src={post.details.image} className="h-12 w-12 rounded-lg" />
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col justify-center">
                                <h3 className="text-black/70 font-bold text-md">{post.details.name}</h3>
                                <div className="flex gap-1 pt-2 pb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <img
                                            key={i}
                                            src={i < post.rating ? "/star-2.png" : "/star-empty.png"}
                                            className="h-4"
                                            alt="star"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
