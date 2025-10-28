import { useState, useRef, useEffect, useContext } from 'react';
import UserContext from "../components/UserContext";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Star } from "lucide-react";

export default function Social() {
    const [posts, setPosts] = useState([]);
    const [postMenu, setPostMenu] = useState(null);
    const [modal, setModal] = useState(false);
    const [editPost, setEditPost] = useState(null);
    const [postId, setPostId] = useState(null);
    const { user, setUser } = useContext(UserContext);
    const [rating, setRating] = useState(0);
    const [caption, setCaption] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef();
    const dropdownRef = useRef();
    const navigate = useNavigate();

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

    const goToPostPage = (id) => {
        navigate("/new-log", { state: { album: id } });
    };

    const handleDeleteClick = (postId) => {
        setPostMenu(postId);
        setModal(true);
    };

    const handleCloseModal = () => {
        setModal(false);
        setPostMenu(null);
    };

    const handleEditPost = (post) => {
        setPostMenu(postId);
        setEditPost(post);
        console.log('test')
    };

    const handleEditPostClose = () => {
        setEditPost(false);
        setPostMenu(null);
    };

    const handlePostMenuClick = (postId) => {
        setPostMenu(prev => (prev === postId ? null : postId));
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

    const handleUpdatePost = async (id, rating, caption, postId) => {
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
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === id ? { ...post, ...data } : post
                )
            );
            navigate(`/post/${postId}`);
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const fetchPosts = async (pageNum) => {
        if (!user?.userId) return;
        try {
            const res = await fetch(
                `http://localhost:3001/api/posts/${user.userId}?page=${pageNum}&limit=10`
            );
            const data = await res.json();
            if (data.data.length === 0) {
                setHasMore(false);
            } else {
                setPosts((prev) => {
                    const newPosts = data.data.filter(
                        (newPost) => !prev.some((oldPost) => oldPost.id === newPost.id)
                    );
                    return [...prev, ...newPosts];
                });

            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user?.userId) fetchPosts(1);
    }, [user?.userId]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );
        if (observerRef.current) observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [hasMore, isLoading]);

    useEffect(() => {
        if (page > 1) fetchPosts(page);
    }, [page]);

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

    if (isLoading && posts.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                no posts yet!
            </div>
        );
    }
    console.log(posts)
    return (
        <>
            <div className={`my-18 lg:grid lg:grid-cols-3 lg:gap-8 xl:gap-14 lg:w-7/8 xl:w-3/4 lg:mx-auto`}>
                {posts.map((post, i) => (
                    <div key={post.id} className={`px-6 sm:w-7/10 sm:mx-auto md:w-3/5 lg:w-full mt-5 lg:mt-0`}>
                        <div className="flex justify-between px-1">
                            <div className="flex flex-row gap-2 pb-1">
                                <div className="flex flex-col justify-end">
                                    <Link to={user.userId === post.user_id ? "/" : `/profile/${post.user_id}`} >
                                        <img src={post.user_image_url} className="h-6 w-6 rounded-3xl"></img>
                                    </Link>
                                </div>
                                <p className="font-semibold text-black/90 flex flex-col justify-center">
                                    {post.username === user.username ? (
                                        <>
                                            {`you logged:`}
                                        </>
                                    ) : (
                                        <>
                                            {`${post.username} logged:`}
                                        </>
                                    )}</p>
                            </div>
                        </div>
                        <div className="bg-gray-500 rounded-xl">
                            <div className="bg-gray-900 rounded-xl flex flex-col items-center pt-4">
                                <img src={post.post_image_url} className="rounded-md w-9/10"></img>
                                <div className="flex justify-between w-full px-4 py-2">
                                    <div className="flex flex-col justify-center text-white">
                                        <div className="text-white/88 font-bold text-2xl">
                                            <Link to={`/${post.type}/${post.music_id}`}>{post.title}</Link>
                                        </div>
                                        <div className="text-white/60 font-semibold text-md">
                                            <Link to={`/artist/${post.music_id}`}>{post.artist}</Link>
                                        </div>
                                        
                                        <div className={`${post.rating === 0 ? 'invisible h-0' : 'flex gap-1 pt-2 pb-1'}`}>
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
                                                setPostId(post.id);
                                            }} className='relative'>
                                                <img src="/dots.png" className="h-5 w-5"></img>
                                                <div
                                                    className={`z-0 absolute right-2 top-5 px-3 w-33 bg-gray-900 rounded-xl transition-all duration-250 text-white ${postMenu === post.id ? "h-auto pb-2 pt-3 border-gray-400 border-2" : "h-0 pointer-events-none"
                                                        }`}
                                                >
                                                    <div className='flex flex-col gap-3'>
                                                        {postMenu === post.id && (
                                                            <>
                                                                {post.username === user.username ? (
                                                                    <>
                                                                        <a ref={dropdownRef} onClick={() => handleEditPost(post)} className="transition-all opacity-100">edit entry</a>
                                                                        <a ref={dropdownRef} onClick={() => handleDeleteClick(post.id)} className="transition-all opacity-100">delete entry</a>
                                                                        <Link ref={dropdownRef} to={`/post/${post.id}`} className="transition-all opacity-100">go to post</Link>
                                                                        <Link to={`/${post.type}/${post.music_id}`} ref={dropdownRef} className="transition-all opacity-100">{`go to ${post.type}`}</Link>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Link ref={dropdownRef} to={`/post/${post.id}`} className="transition-all opacity-100">go to post</Link>
                                                                        <a ref={dropdownRef} onClick={() => { goToPostPage(post.music_id) }} className="transition-all opacity-100">{`log this ${post.type}`} </a>
                                                                        <a ref={dropdownRef} className="transition-all opacity-100">report</a>
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
                                {post.caption && (
                                    <div>
                                        <p className="flex flex-row gap-1 text-white font-normal">
                                            <Link
                                                to={user.userId === post.user_id ? "/" : `/profile/${post.user_id}`}
                                                className="font-bold text-white/90"
                                            >
                                                {post.username}
                                            </Link>
                                            {post.caption}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-2 pt-1 border-t-2 border-gray-600">
                                    {post.comments && post.comments.length > 0 ? (
                                        post.comments.map((comment) => (
                                            <div key={comment.id} className="flex flex-row gap-1 text-white pt-1">
                                                <span className="font-bold text-white/90">{comment.author}</span>
                                                <span>{comment.content}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-white/60 text-sm">No comments yet.</p>
                                    )}
                                </div>
                                <div className=''>
                                    <Link to={`/post/${post.id}`} className='underline text-sm text-white/80'>comment</Link>
                                </div>

                            </div>
                        </div>
                        <div className="w-full flex justify-end pt-2">
                            <p className="text-xs flex flex-col justify-end pb-[2px]">{timeAgo(post.created_at)}</p>
                        </div>
                    </div>

                ))}
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
                                    onClick={() => {
                                        handleDeletePost(postId);
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
                                <p className='font-medium pb-1 underline pl-2 text-gray-900' onClick={() => { handleUpdatePost(editPost.id, rating, caption, editPost.id); }}>Update</p>
                                <button src='/close2.png' className='font-medium pb-1 underline pr-2 text-gray-700' onClick={() => { handleEditPostClose(); }}>Cancel</button>
                            </div>
                            <div className="bg-gray-500 rounded-xl">
                                <div className="bg-gray-900 rounded-xl flex flex-col items-center pt-4">
                                    <img src={editPost.post_image_url} className="rounded-md w-9/10"></img>
                                    <div className="flex justify-between w-full px-4 py-2">
                                        <div className="flex flex-col justify-center text-white">
                                            <h3 className="text-white/88 font-bold text-2xl">{editPost.title}</h3>
                                            <h4 className="text-white/60 font-semibold text-md">{editPost.artist}</h4>
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
                                                <div className={`flex justify-center items-center ${rating === 0 ? 'invisible' : 'visible'}`}>
                                                    <img src='close.png' className='h-[10px]' onClick={() => setRating(0)}></img>
                                                </div>
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
                                        <textarea placeholder={`${editPost.caption ? `${editPost.caption}` : 'caption'}`} className='px-1 placeholder-white/70 focus:outline-none focus:none text-white' value={caption} onChange={(e) => setCaption(e.target.value)}></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
                <div ref={observerRef} className="h-10"></div>
                {isLoading && (
                    <div className="flex justify-center py-6">
                        <div className="w-6 h-6 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </>
    );
}
