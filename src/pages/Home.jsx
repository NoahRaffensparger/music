import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect, useContext } from 'react';
import UserContext from "../components/UserContext";

export default function Profile() {
    const location = useLocation();
    const { user, setUser } = useContext(UserContext);
    const id = user?.userId;
    const [postId, setPostId] = useState(false);
    const [modal, setModal] = useState(false);
    const segments = location.pathname.split("/");
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [headerSong, setHeaderSong] = useState(null);
    const [headerSongArtist, setHeaderSongArtist] = useState(null);
    const [userInfo, setUserInfo] = useState(false);
    const [tab, setTab] = useState('log');
    const [isLoading, setIsLoading] = useState(true);
    const profileMenuRef = useRef();
    let content

    useEffect(() => {
        const fetchUserInfo = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`http://localhost:3001/api/user/${id}`);
                const data = await res.json();
                const userInfo = data.data[0];
                const posts = userInfo.posts
                // const headerInfo = await fetchTrackInfo(userInfo.profile_song_href);
                // setHeaderSong(headerInfo);

                // const headerArtist = await fetchArtistInfo(headerInfo.artist_href);
                // setHeaderSongArtist(headerArtist);
                // console.log(headerInfo)
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

    const resetUserInfo = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:3001/api/user/${id}`);
            const data = await res.json();
            const userInfo = data.data[0];
            const posts = userInfo.posts
            // const headerInfo = await fetchTrackInfo(userInfo.profile_song_href);
            // setHeaderSong(headerInfo);

            // const headerArtist = await fetchArtistInfo(headerInfo.artist_href);
            // setHeaderSongArtist(headerArtist);
            // console.log(headerInfo)
            setUserInfo(userInfo);
            setPosts(posts);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (modal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [modal]);

    const handleDeleteClick = (id) => {
        setPostId(id)
        setModal(true);
    };

    const handleCloseModal = () => {
        setModal(false);
    };

    // const fetchTrackInfo = async (id) => {
    //     try {
    //         const res = await fetch(`http://localhost:3001/api/track/${id}`);
    //         if (!res.ok) throw new Error("Spotify track fetch failed");
    //         const data = await res.json()
    //         return {
    //             name: data.name,
    //             image: data.album?.images?.[0]?.url,
    //             artists: data.artists.map((artist) => artist.name).join(", "),
    //             url: data.external_urls?.spotify,
    //             artist_href: data.artists[0].href.split("/").pop()
    //         };

    //     } catch (err) {
    //         console.error("Error fetching track:", err);
    //         return null;
    //     }
    // };
    console.log(posts)
    if (tab === 'log') {
        content = posts && posts.length > 0 ? (
            posts.map((post) => (
                <div key={post.id} className="mx-2 sm:max-w-7/8 sm:mx-auto md:max-w-3/4 lg:max-w-5/8">
                    <div className="flex p-2 gap-2 border-t-2 border-gray-300">
                        <Link to={`/post/${post.post_id}`} className='w-14'>
                            <img src={post.image_url} className="h-12 w-full rounded-lg" />
                        </Link>
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col w-full justify-between">
                                <div className='flex justify-between'>
                                    <Link to={`/post/${post.post_id}`} className="text-black/70 font-bold text-md">{post.title}</Link>
                                    <img src='close2.png' className='h-[10px]' onClick={() => handleDeleteClick(post.post_id)}></img>
                                </div>
                                <div className="flex flex-row justify-between">
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

                                    <div className="flex items-end">
                                        <p>{formatDateTime(post.created_at)}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div >
            ))
        ) : (
            <p className="text-center text-gray-500 py-6">No logs yet</p>
        );
    } else if (tab === 'songs') {
        const songPosts = posts?.filter((post) => post.type === 'song') || [];

        content = songPosts.length > 0 ? (
            songPosts.map((post) => (
                <div key={post.id} className="mx-2 sm:max-w-7/8 sm:mx-auto md:max-w-3/4 lg:max-w-5/8">
                    <div className="flex p-2 gap-2 border-t-2 border-gray-300">
                        <Link to={`/post/${post.post_id}`} className='w-14'>
                            <img src={post.image_url} className="h-12 w-full rounded-lg" />
                        </Link>
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col w-full justify-between">
                                <div className='flex justify-between'>
                                    <Link to={`/post/${post.post_id}`} className="text-black/70 font-bold text-md">{post.title}</Link>
                                    <img src='close2.png' className='h-[10px]' onClick={() => handleDeleteClick(post.post_id)}></img>
                                </div>
                                <div className="flex flex-row justify-between">
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

                                    <div className="flex items-end">
                                        <p>{formatDateTime(post.created_at)}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <p className="text-center text-gray-500 py-6">No artist logs</p>
        );
    } else if (tab === 'artists') {
        const artistPosts = posts?.filter((post) => post.type === 'artist') || [];

        content = artistPosts.length > 0 ? (
            artistPosts.map((post) => (
                <div key={post.id} className="mx-2 sm:max-w-7/8 sm:mx-auto md:max-w-3/4 lg:max-w-5/8">
                    <div className="flex p-2 gap-2 border-t-2 border-gray-300">
                        <Link to={`/post/${post.post_id}`} className='w-14'>
                            <img src={post.image_url} className="h-12 w-full rounded-lg" />
                        </Link>
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col w-full justify-between">
                                <div className='flex justify-between'>
                                    <Link to={`/post/${post.post_id}`} className="text-black/70 font-bold text-md">{post.title}</Link>
                                    <img src='close2.png' className='h-[10px]' onClick={() => handleDeleteClick(post.post_id)}></img>
                                </div>
                                <div className="flex flex-row justify-between">
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

                                    <div className="flex items-end">
                                        <p>{formatDateTime(post.created_at)}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <p className="text-center text-gray-500 py-6">No artist logs</p>
        );
    } else if (tab === 'albums') {
        const albumPosts = posts?.filter((post) => post.type === 'album') || [];

        content = albumPosts.length > 0 ? (
            albumPosts.map((post) => (
                <div key={post.id} className="mx-2 sm:max-w-7/8 sm:mx-auto md:max-w-3/4 lg:max-w-5/8">
                    <div className="flex p-2 gap-2 border-t-2 border-gray-300">
                        <Link to={`/post/${post.post_id}`} className='w-14'>
                            <img src={post.image_url} className="h-12 w-full rounded-lg" />
                        </Link>
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col w-full justify-between">
                                <div className='flex justify-between'>
                                    <Link to={`/post/${post.post_id}`} className="text-black/70 font-bold text-md">{post.title}</Link>
                                    <img src='close2.png' className='h-[10px]' onClick={() => handleDeleteClick(post.post_id)}></img>
                                </div>
                                <div className="flex flex-row justify-between">
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

                                    <div className="flex items-end">
                                        <p>{formatDateTime(post.created_at)}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <p className="text-center text-gray-500 py-6">No album logs</p>
        );
    }

    // const fetchAlbumInfo = async (id) => {
    //     try {
    //         const res = await fetch(`http://localhost:3001/api/album/${id}`);
    //         if (!res.ok) throw new Error("Spotify album fetch failed");
    //         const data = await res.json()
    //         return {
    //             name: data.name,
    //             image: data.images?.[0]?.url,
    //             artists: data.artists.map((artist) => artist.name).join(", "),
    //             url: data.external_urls?.spotify,
    //         };
    //     } catch (err) {
    //         console.error("Error fetching album:", err);
    //         return null;
    //     }
    // };

    // const fetchArtistInfo = async (id) => {
    //     try {
    //         const res = await fetch(`http://localhost:3001/api/artist/${id}`);
    //         if (!res.ok) throw new Error("Spotify artist fetch failed");
    //         const data = await res.json()
    //         return {
    //             name: data.name,
    //             image: data.images?.[0]?.url,
    //             url: data.external_urls?.spotify,
    //         };
    //     } catch (err) {
    //         console.error("Error fetching artist:", err);
    //         return null;
    //     }
    // };

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

    function formatDateTime(dateString) {
        const date = new Date(dateString);

        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };

        return date.toLocaleString('en-US', options);
    }

    const handleDeletePost = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/api/post/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok) {
                throw new Error(`Failed to delete post: ${res.status}`);
            }
            const data = await res.json();
            console.log("Post deleted:", data);
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));

        } catch (err) {
            console.error("Error:", err);

        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }
    return (
        <>
            <div className="mt-11 relative bg-cover bg-center h-38" style={{ backgroundImage: `url(${userInfo.header_image_url})` }}>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative flex px-6 gap-4 items-center h-full sm:max-w-4/5 sm:mx-auto sm:px-0">
                    <img
                        src={userInfo.header_image_url}
                        className="h-20 w-auto rounded-xl"
                    />
                    <div>
                        <h2 className="font-medium text-white text-lg">{userInfo.header_name}</h2>
                        <p className="text-gray-200">{userInfo.header_artists}</p>
                    </div>
                </div>
            </div>
            <div className="mx-2">
                <div className="py-4 flex justify-between items-center sm:max-w-4/5 sm:mx-auto">
                    <div className="flex gap-2">
                        <img src={userInfo.image_url} className="h-12 w-12 rounded-full"></img>

                        <div className="leading-none">
                            <h3 className="text-xl font-medium text-black/90">{`${userInfo.username}`}</h3>
                            <p className="text-sm font-semibold text-black/80">
                                {(() => {
                                    const count = posts.length;
                                    if (count < 10) return "casual listener";
                                    if (count < 35) return "radio regular";
                                    if (count < 65) return "album explorer";
                                    if (count < 100) return "genre hopper";
                                    if (count < 140) return "deep diver";
                                    if (count < 185) return "curator";
                                    if (count < 235) return "audiophile";
                                    if (count < 290) return "taste maker";
                                    if (count < 350) return "collector";
                                    if (count < 415) return "music scholar";
                                    return "music encyclopedia";
                                })()}
                            </p>
                        </div>
                    </div>
                    <div ref={profileMenuRef} className='relative'>
                        <img onClick={handleProfileMenuClick} src="/black-dots.png" className="h-5 pr-2 z-50"></img>
                        <div className={`top-6 z-0 absolute right-0 px-3 flex flex-col gap-3 w-26 bg-white rounded-xl transition-all duration-250 ${isProfileMenuOpen ? 'h-[120px] pb-2 pt-3 border-gray-300 border-1' : 'h-0 pointer-events-none'}`}>
                            <Link to='/edit' className={`transition-all ${isProfileMenuOpen ? 'opacity-100 duration-100' : 'opacity-0'}`}>edit profile</Link>
                            <Link to='/followers' className={`transition-all ${isProfileMenuOpen ? 'opacity-100 duration-400' : 'opacity-0'}`}>followers</Link>
                            <a className={`transition-all ${isProfileMenuOpen ? 'opacity-100 duration-400' : 'opacity-0'}`}>following</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex justify-between mx-6 px-1 pb-4 border-gray-700 sm:max-w-2/3 sm:mx-auto '>
                <a to='/profile/user/log' onClick={() => handleTabClick('log')} className={`font-medium text-md ${tab === 'log' ? 'underline underline-offset-5 decoration-3 decoration-gray-700' : ''}`}>log</a>
                <a to='/profile/user/songs' onClick={() => handleTabClick('songs')} className={`font-medium text-md ${tab === 'songs' ? 'underline underline-offset-5 decoration-3 decoration-gray-700' : ''}`}>songs</a>
                <a to='/profile/user/artists' onClick={() => handleTabClick('artists')} className={`font-medium text-md ${tab === 'artists' ? 'underline underline-offset-5 decoration-3 decoration-gray-700' : ''}`}>artists</a>
                <a to='/profile/user/albums' onClick={() => handleTabClick('albums')} className={`font-medium text-md ${tab === 'albums' ? 'underline underline-offset-5 decoration-3 decoration-gray-700' : ''}`}>albums</a>
            </div>

            {content}

            <div className='mb-14'></div>

            {modal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded-xl p-4 w-80 shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Delete log?</h2>
                        <div className="flex justify-start gap-3">
                            <button
                                onClick={handleCloseModal}
                                className="px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleDeletePost(postId);
                                    handleCloseModal();
                                    resetUserInfo()
                                }}
                                className="px-2 py-1 rounded-md bg-gray-800 text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>

    );
}
