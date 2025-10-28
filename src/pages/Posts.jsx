import { useEffect, useState, useRef, useContext } from "react";
import UserContext from "../components/UserContext";
import { Link, useLocation } from 'react-router-dom';
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Posts() {
    const location = useLocation();
    const segments = location.pathname.split("/");
    const id = segments[segments.length - 1];
    const [postMenu, setPostMenu] = useState(null);
    const [editPost, setEditPost] = useState(null);
    const [post, setPost] = useState(null)
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(0);
    const [caption, setCaption] = useState(null);
    const [comment, setComment] = useState(null);
    const { user, setUser } = useContext(UserContext);
    const [modal, setModal] = useState(false);
    const navigate = useNavigate();

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
            navigate("/");
        } catch (err) {
            console.error("Error:", err);

        }
    };

    const handleEditPostClose = () => {
        setEditPost(false);
    };

    const handleCloseModal = () => {
        setModal(false);
        setPostMenu(null);
    };
    const handleUpdatePost = async (id, rating, caption) => {
        try {
            const res = await fetch(`http://localhost:3001/api/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rating: rating,
                    caption: caption,
                }),
            });

            if (!res.ok) {
                throw new Error(`Failed to update post: ${res.status}`);
            }

            const data = await res.json();
            console.log("Post updated:", data);
            handleEditPostClose()
            window.location.reload();
        } catch (err) {
            console.error("Error:", err);
        }
    };

    useEffect(() => {
        if (id) fetchPost(id);
    }, [id]);

    const handlePostMenuClick = (postId) => {
        setPostMenu(prev => (prev === postId ? null : postId));
    }

    const handleEditPost = (post) => {
        setEditPost(post);
        console.log('test')
    };

    const handleDeleteClick = (postId) => {
        setModal(true);
    };

    const fetchPost = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/api/post/${id}`);
            if (!res.ok) throw new Error("Fetch failed");
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            if (!data.data || data.data.length === 0) {
                throw new Error("Post not found");
            }
            const thisPost = data.data[0];

            let details = null;
            if (thisPost.type === "song") {
                details = await fetchTrackInfo(thisPost.music_id);
            } else if (thisPost.type === "album") {
                details = await fetchAlbumInfo(thisPost.music_id);
            } else if (thisPost.type === "artist") {
                details = await fetchArtistInfo(thisPost.music_id);
            }

            setPost({ ...thisPost, details });
            setError(false);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(true);
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
    const uploadComment = async (post_id, user_id, content) => {
        if (!content || content.trim() === "") {
            console.warn("Comment cannot be empty");
            return;
        }

        try {
            const res = await fetch(`http://localhost:3001/api/add-comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({ post_id, user_id, content }),
            });

            const data = await res.json();
            setComment('');
            fetchPost(post_id);
        } catch (err) {
            console.error("Error:", err);
        }
    };
    if (!post && !error) {
        return (
            <div className='w-screen flex justify-center mt-12'>
                <img src='/loading.png' className="h-[28px] animate-spin px-auto"></img>
            </div>
        )
    }
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center mt-20">
                <h1 className="text-3xl font-bold mb-4">404 - Post Not Found</h1>
                <p className="text-gray-600 mb-6">
                    Sorry, we couldn’t find the post you were looking for.
                </p>
                <Link
                    to="/"
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                >
                    Go Back Home
                </Link>
            </div>
        );
    }

    return (
        <>
            <div
                key={post.id}
                className='mx-6 mb-14 sm:w-7/10 sm:mx-auto md:w-3/5 lg:w-full mt-18 lg:mt-0'
            >
                <div className="flex justify-between px-1">
                    <div className="flex flex-row gap-2 pb-1">
                        <div className="flex flex-col justify-end">
                            <img src="profile-ben.jpg" className="h-6 w-6 rounded-3xl" />
                        </div>
                        <p className="font-semibold text-black/90 flex flex-col justify-center">
                            {`${post.username} listened to:`}
                        </p>
                    </div>
                </div>
                <div className="bg-gray-500 rounded-xl">
                    <div className="bg-gray-900 rounded-xl flex flex-col items-center pt-4">
                        <img src={post.details?.image} className="rounded-md w-9/10" />
                        <div className="flex justify-between w-full px-4 py-2">
                            <div className="flex flex-col justify-center text-white">
                                <Link to={`/track/${post.details.url.split("/").pop()}`} className="text-white/88 font-bold text-2xl">
                                    {post.details?.name}
                                </Link>
                                <h4 className="text-white/60 font-semibold text-md">
                                    {post.details?.artists}
                                </h4>
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
                            <div className="flex flex-col justify-between">
                                <div className="flex flex-row justify-end pt-2">
                                    <div onClick={() => {
                                        handlePostMenuClick(post.id);
                                    }} className="relative">
                                        <img src="/dots.png" className="h-5 w-5" />
                                        <div
                                            className={`z-0 absolute right-2 top-5 px-3 w-32 bg-gray-900 rounded-xl transition-all duration-250 text-white ${postMenu === post.id ? "h-auto pb-2 pt-3 border-gray-400 border-2" : "h-0 pointer-events-none"
                                                }`}
                                        >
                                            <div className='flex flex-col gap-3'>
                                                {postMenu === post.id && (
                                                    <>
                                                        {post.username === user.username ? (
                                                            <>
                                                                <a onClick={() => handleEditPost(post)} className="transition-all opacity-100">edit entry</a>
                                                                <a onClick={() => handleDeleteClick(post.id)} className="transition-all opacity-100">delete entry</a>
                                                                <Link to={`/track/${post.details.url.split("/").pop()}`} className="transition-all opacity-100">{`go to ${post.type}`}</Link>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <a className="transition-all opacity-100">report</a>
                                                                <a className="transition-all opacity-100">go to post</a>
                                                                <a className="transition-all opacity-100">copy link</a>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <p className="font-semibold text-sm text-white/85">{post.type}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col p-2 bg-gray-500 rounded-xl">
                        <div>
                            <p className="flex flex-row gap-1 text-white font-normal">
                                <span className="font-bold text-white/90">{post.username}</span>
                                {post.caption}
                            </p>
                        </div>

                        <div className="mt-2 pt-1 border-t-2 border-gray-600">
                            {post.comments && post.comments.length > 0 ? (
                                post.comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="flex flex-row gap-1 text-white pt-1"
                                    >
                                        <span className="font-bold text-white/90">
                                            {comment.author}
                                        </span>
                                        <span>{comment.content}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-white/60 text-sm">No comments yet.</p>
                            )}
                        </div>
                        <div className='flex gap-2 items-center bg-gray-200 rounded-sm mt-1'>
                            <textarea
                                value={comment || ""}
                                onChange={(e) => setComment(e.target.value)}
                                className="bg-gray-200 focus:outline-none w-full px-1 py-[1px] rounded-sm max-h-20"
                                placeholder="add a comment"
                            />
                            <img src="/right-arrow.png" onClick={() => uploadComment(post.id, 1, comment)} className="h-4 pr-1 cursor-pointer"></img>
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-end pt-2">
                    <p className="text-xs flex flex-col justify-end pb-[2px]">
                        {timeAgo(post.created_at)}
                    </p>
                </div>
            </div>
            {modal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Delete Post?</h2>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete this post? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    await handleDeletePost(id);
                                    handleCloseModal();
                                }}
                                className="px-4 py-2 rounded-md bg-gray-800 text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {editPost && (
                <div className="fixed inset-0 px-6 pt-30 sm:w-7/10 sm:mx-auto md:w-3/5 lg:w-full lg:mt-0 bg-black/50 z-50">
                    <div className='bg-white px-4 pt-4 pb-4 rounded-xl'>
                        <div className='flex w-full justify-between items-center'>
                            <p className='font-medium pb-1 underline pl-2 text-gray-900' onClick={() => { handleUpdatePost(editPost.id, rating, caption); }}>Update</p>
                            <button src='/close2.png' className='font-medium pb-1 underline pr-2 text-gray-700' onClick={() => { handleEditPostClose(); }}>Cancel</button>
                        </div>
                        <div className="bg-gray-500 rounded-xl">
                            <div className="bg-gray-900 rounded-xl flex flex-col items-center pt-4">
                                <img src={editPost.details.image} className="rounded-md w-9/10"></img>
                                <div className="flex justify-between w-full px-4 py-2">
                                    <div className="flex flex-col justify-center text-white">
                                        <h3 className="text-white/88 font-bold text-2xl">{editPost.details.name}</h3>
                                        <h4 className="text-white/60 font-semibold text-md">{editPost.details.artists}</h4>
                                        <div className={`flex gap-2 pt-2`}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className="focus:outline-none"
                                                >
                                                    <Star
                                                        size={20}
                                                        className={`transition-all duration-100 cursor-pointer font-light ${(rating) >= star ? "fill-yellow-400 text-gray-700" : "text-gray-400"
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between">
                                        <div className="flex flex-row justify-end pt-2">
                                        </div>
                                        <p className="font-semibold text-sm text-white/85">{editPost.type}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col p-2 bg-gray-500 rounded-xl">
                                <div className='flex gap-2'>
                                    <p className="font-bold text-white/90">{editPost.username}</p>
                                    <textarea placeholder={editPost.caption} className='px-1 placeholder-white/70 focus:outline-none focus:none text-white' value={caption} onChange={(e) => setCaption(e.target.value)}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </>
    );
}
