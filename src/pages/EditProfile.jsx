import { useState, useRef, useEffect, useContext } from 'react';
import UserContext from "../components/UserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ImageUpload from '../components/ImageUpload';

export default function EditProfile() {
    const { user, setUser } = useContext(UserContext);
    const [modal, setModal] = useState(false);
    const [uploadImage, setUploadImage] = useState(false);
    const [username, setUsername] = useState(false);
    const [usernameChange, setUsernameChange] = useState(null);
    const [usernameError, setUsernameError] = useState(null);
    const [usernameErrorSame, setUsernameErrorSame] = useState(false);
    const modalRef = useRef(null);
    const [trackResults, settrackResults] = useState([]);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const handleUploaded = (url) => {
        console.log("Uploaded image URL:", url);
    };

    useEffect(() => {
        if (query.length < 2) {
            settrackResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/search/q=${encodeURIComponent(query)}`);
                const data = await res.json();
                settrackResults(data);
            } catch (err) {
                console.error(err);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [query]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setModal(false);
                setQuery('');
                settrackResults([]);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const handleCloseModal = () => {
        setModal(false);
        setQuery('');
        settrackResults([]);
    };

    const changeHeaderSong = async (id, artistsHref, artists, imageUrl, name, href) => {
        try {
            const res = await fetch(`http://localhost:3001/api/users/header/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    artistsHref: artistsHref,
                    artists: artists,
                    imageUrl: imageUrl,
                    name: name,
                    href: href,
                }),
            });

            if (!res.ok) {
                throw new Error(`Failed to update user: ${res.status}`);
            }

            const data = await res.json();
            setUser(prev => ({
                ...prev,
                header_image_url: imageUrl,
                header_name: name,
                header_artists: artists,
            }));
            handleCloseModal();

            console.log("User updated:", data);
            handleCloseModal();
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const handleChangeUsername = async (id, username) => {
        try {
            const res = await fetch(`http://localhost:3001/api/change-username`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: id,
                    username: username
                }),
            });

            if (!res.ok) {
                throw new Error(`Failed to update user: ${res.status}`);
            }

            const data = await res.json();
            console.log("Username updated", data);
            setUsername(false)
            setUsernameError(false)
            setUsernameErrorSame(false)
            setUsernameChange(null)
            setUser(prev => ({
                ...prev,
                username: username
            }));
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        <>
            <div className='mt-12'>
                <div>
                    <Link to='/' className='font-medium mx-2'>{`< back`}</Link>
                </div>
                <div className='flex flex-col items-start mx-2'>
                    <div className='w-full mt-2 border-b-1 pb-2'>
                        <div className="relative bg-cover bg-center h-22 rounded-xl" style={{ backgroundImage: `url(${user.header_image_url})` }}>
                            <div className="absolute inset-0 bg-black/50 rounded-xl"></div>
                            <div className="relative flex px-6 items-center justify-between h-full sm:max-w-4/5 sm:mx-auto sm:px-0">
                                <div className='flex items-center gap-4'>
                                    <img
                                        src={user.header_image_url}
                                        className="h-16 w-auto rounded-xl"
                                    />
                                    <div>
                                        <h2 className="font-medium text-white text-lg">{user.header_name}</h2>
                                        <p className="text-gray-200">{user.header_artists}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <button className='bg-gray-500 text-white/90 px-2 rounded-sm font-medium mt-2' onClick={() => { setModal(true); }}>Edit Header Song</button>
                    </div>
                    <div className='mt-4 border-b-1 w-full pb-4'>
                        <img src={`${user.image_url ? user.image_url : '/empty-profile-pic.jpg'}`} className='rounded-full h-18 w-18 object-cover mb-2'></img>
                        <button className='bg-gray-500 text-white/90 px-2 rounded-sm font-medium ' onClick={() => { setUploadImage(true); }} >Edit Profile Picture</button>
                        <div className={`${uploadImage ? "visible" : "invisible"}`}>
                            <ImageUpload
                                uploadUrl="http://localhost:3001/api/update-user-image"
                                onUpload={(url) => {
                                    handleUploaded();
                                    setUser(prev => ({
                                        ...prev,
                                        image_url: url
                                    }));
                                }}
                                userId={user.userId}
                                fieldName="image"
                                maxSizeMB={5}
                                onClose={() => {
                                    setUploadImage(false);
                                }}
                            ></ImageUpload>

                        </div>

                    </div>
                    <div className='mt-2 flex flex-col w-full'>
                        <p className='font-medium text-lg w-full mb-2'>{`${user.username}`}</p>
                        {username && (
                            <textarea placeholder={`${user.username}`} className='bg-gray-200' value={usernameChange} onChange={(e) => setUsernameChange(e.target.value)}>

                            </textarea>
                        )}

                        {!username && (
                            <button className='bg-gray-500 text-white/90 px-2 rounded-sm font-medium w-[125px]' onClick={() => { setUsername(true); }}>Edit Username</button>
                        )}

                        {usernameError && (
                            <div className="text-red-600">
                                Username cannot be empty
                            </div>
                        )}

                        {usernameErrorSame && (
                            <div className="text-red-600">

                                Username is already
                            </div>
                        )}

                        {username && (
                            <div className='flex flex-row gap-2 items-center mt-2'>
                                <button className='bg-gray-500 text-white/90 px-2 rounded-sm font-medium w-[150px]' onClick={() => {
                                    if (usernameChange === user.username) {
                                        setUsernameErrorSame(true)
                                    } else if (usernameChange === '') {
                                        setUsernameError(true)
                                    } else {
                                        handleChangeUsername(user.userId, usernameChange)
                                    }
                                }}>Change Username</button>
                                <button className='text-black/90 px-2 rounded-sm font-medium border-1' onClick={() => {
                                    setUsername(false)
                                    setUsernameError(false)
                                    setUsernameErrorSame(false)
                                    setUsernameChange(null)
                                }}>Cancel</button>
                            </div>

                        )}

                    </div>
                </div>

            </div >
            {modal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <form className="bg-white rounded-xl p-4 w-80 shadow-lg h-3/4" ref={modalRef}>
                        <div className='flex w-full justify-end mb-2'>
                            <img src='/close2.png' className='h-3 mr-1' onClick={handleCloseModal}></img>
                        </div>

                        <input className="text-md font-medium w-full pl-2 py-1 bg-gray-200 rounded-md" placeholder='Search songs' value={query} onChange={(e) => setQuery(e.target.value)}></input>
                        {
                            trackResults.length > 0 && (
                                <ul className="mt-1">
                                    {trackResults.map((trackResults, i) => (
                                        <div key={i} className="flex items-center p-2 gap-3 mt-[4px] border-b-1 border-gray-300" onClick={async () => {
                                            await changeHeaderSong(user.userId, trackResults.artist_href, trackResults.artists, trackResults.image, trackResults.name, trackResults.href);
                                        }}>
                                            <img
                                                src={trackResults.image}
                                                alt={trackResults.name}
                                                className="w-12 h-12 rounded"
                                            />
                                            <div className='flex flex-row justify-between w-full h-[44px]'>
                                                <div className='flex flex-col justify-center'>
                                                    <p className={trackResults.name.length > 20 ? "text-sm font-semibold" : "text-base font-semibold"}> {trackResults.name}
                                                    </p>

                                                    {trackResults.artists && (
                                                        <p className={trackResults.artists.length > 20 ? "text-xs text-gray-500" : "text-sm text-gray-500"}> {trackResults.artists}
                                                        </p>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </ul>
                            )
                        }
                    </form>
                </div>
            )
            }
        </>

    );
}
