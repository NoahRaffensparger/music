import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export default function Track() {
    const location = useLocation();
    const segments = location.pathname.split("/");
    const id = segments[segments.length - 1];
    const [track, setTrack] = useState({})
    const [posts, setPosts] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        if (id) fetchTrackInfo(id), fetchPosts(id);
    }, [id]);

    const goToPostPage = () => {
        navigate("/new-log", { state: { track: id } });
    };

    const fetchTrackInfo = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/api/track/${id}`);
            if (!res.ok) throw new Error("Spotify track fetch failed");
            const data = await res.json()
            return setTrack({
                name: data.name,
                image: data.album?.images?.[0]?.url,
                artists: data.artists.map((artist) => artist.name).join(", "),
                url: data.external_urls?.spotify,
            });
        } catch (err) {
            console.error("Error fetching track:", err);
            return null;
        }
    };

    const fetchPosts = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/api/posts/music/${id}`);
            if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
            const data = await res.json();
            setPosts(data.posts);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    return (
        <>
            <div
                className='mb-14 mt-11 lg:mt-0'
            >
                <div className="">
                    <div className="rounded-xl flex flex-col items-center">
                        <img src={track.image} className=""/>
                        <div className="flex justify-between w-full px-6 py-2">
                            <div className="flex flex-col justify-center text-white">
                                <h3 className="text-black/88 font-bold text-3xl">
                                    {track.name}
                                </h3>
                                <h4 className="text-black/60 font-semibold text-xl">
                                    {track.artists}
                                </h4>

                            </div>
                            <div className="flex flex-col justify-between ">
                                <div className="flex flex-row justify-end pt-2">
                                </div>
                                <p className="font-semibold text-sm text-white/85">track</p>
                            </div>

                        </div>
                        <div className="w-full pb-2 flex justify-start">
                            <button className="text-black font-medium ml-6 bg-gray-300 px-2 py-1 rounded-sm" onClick={() => {goToPostPage()}}>
                                log this track
                            </button>
                            <button className="text-black font-medium ml-4 bg-gray-300 px-2 rounded-sm">
                                add to playlist
                            </button>
                        </div>
                        {posts.map((post) => (
                            <div key={post.id} className={`w-full bg-gray-600 p-3 pt-4`}>
                                <div className="rounded-xl">
                                    <div className="rounded-xl flex flex-col items-center">
                                        <div className="flex justify-between w-full">
                                            <div className="flex gap-1 pb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <img
                                                        key={i}
                                                        src={i < post.rating ? "/star-2.png" : "/star-empty.png"}
                                                        className="h-5"
                                                        alt="star"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col rounded-xl">
                                        <div>
                                            <p className="flex flex-row gap-1 text-white font-normal"><span className="font-bold text-white/90">{post.username}</span>{post.caption}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </>
    );
}
