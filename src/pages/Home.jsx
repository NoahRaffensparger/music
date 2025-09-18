import { useEffect, useState } from "react";

export default function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3001/api/posts")
            .then((res) => res.json())
            .then((data) => {
                console.log("Posts API response:", data);
                setPosts(data.data);
            })
            .catch((err) => console.error("Fetch error:", err));
    }, []);

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

    return (
        <>
            <div className="my-18 lg:grid lg:grid-cols-3 lg:gap-8 xl:gap-14 lg:w-7/8 xl:w-3/4 lg:mx-auto">
                {posts.map((post) => (
                    <div className="mx-6 sm:w-7/10 sm:mx-auto md:w-3/5 lg:w-full mt-10 lg:mt-0">
                        <div className="flex justify-between px-1">
                            <div className="flex flex-row gap-2 pb-1">
                                <div className="flex flex-col justify-end">
                                    <img src="profile-ben.jpg" className="h-6 w-6 rounded-3xl"></img>
                                </div>
                                <p className="font-semibold text-black/90 flex flex-col justify-center">{`${post.username} listened to:`}</p>
                            </div>
                        </div>
                        <div className="bg-gray-500 rounded-xl">
                            <div className="bg-gray-900 rounded-xl flex flex-col items-center pt-4">
                                <img src="/album-cover.jpg" className="rounded-md w-9/10"></img>
                                <div className="flex justify-between w-full px-4 py-2">
                                    <div className="flex flex-col justify-center text-white">
                                        <h3 className="text-white/88 font-bold text-2xl">Sometimes...</h3>
                                        <h4 className="text-white/60 font-semibold text-md">Tyler, The Creator</h4>
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
                                            <img src="/dots.png" className="h-5 w-5"></img>
                                        </div>
                                        <p className="font-semibold text-sm text-white/85">{post.type}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col p-2 bg-gray-500 rounded-xl">
                                <div>
                                    <p className="flex flex-row gap-1 text-white font-normal"><p className="font-bold text-white/90">{post.username}</p>{post.caption}</p>
                                </div>
                                <a className="underline text-sm text-white/80">comment</a>
                            </div>
                        </div>
                        <div className="w-full flex justify-end pt-2">
                            <p className="text-xs flex flex-col justify-end pb-[2px]">{timeAgo(post.created_at)}</p>
                        </div>
                    </div>
                ))}






                <div className="mx-6 sm:w-7/10 sm:mx-auto md:w-3/5 lg:w-full mt-10 lg:mt-0">
                    <div className="flex justify-between px-1">
                        <div className="flex flex-row gap-2 pb-1">
                            <div className="flex flex-col justify-end">
                                <img src="profile-ben.jpg" className="h-6 w-6 rounded-3xl"></img>
                            </div>
                            <p className="font-semibold text-black/90 flex flex-col justify-center">ben carson listened to:</p>
                        </div>
                    </div>
                    <div className="bg-gray-500 rounded-xl">
                        <div className="bg-gray-900 rounded-xl flex flex-col items-center pt-4">
                            <img src="/album-cover.jpg" className="rounded-md w-9/10"></img>
                            <div className="flex justify-between w-full px-4 py-2">
                                <div className="flex flex-col justify-center text-white">
                                    <h3 className="text-white/88 font-bold text-2xl">Sometimes...</h3>
                                    <h4 className="text-white/60 font-semibold text-md">Tyler, The Creator</h4>
                                    <div className="flex gap-1 pt-2 pb-1">
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-empty.png' className="h-4"></img>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <div className="flex flex-row justify-end pt-2">
                                        <img src="/dots.png" className="h-5 w-5"></img>
                                    </div>
                                    <p className="font-semibold text-sm text-white/85">song</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col p-2 bg-gray-500 rounded-xl">
                            <div>
                                <p className="flex flex-row gap-1 text-white font-normal"><p className="font-bold text-white/90">ben carson</p>favorite song right now</p>
                            </div>
                            <a className="underline text-sm text-white/80">comment</a>
                        </div>
                    </div>
                    <div className="w-full flex justify-end pt-2">
                        <p className="text-xs flex flex-col justify-end pb-[2px]">34 minutes ago</p>
                    </div>
                </div>


                <div className="mx-6 sm:w-7/10 sm:mx-auto md:w-3/5 lg:w-full mt-10 lg:mt-0">
                    <div className="flex justify-between px-1">
                        <div className="flex flex-row gap-2 pb-1">
                            <div className="flex flex-col justify-end">
                                <img src="profile-ben.jpg" className="h-6 w-6 rounded-3xl"></img>
                            </div>
                            <p className="font-semibold text-black/90 flex flex-col justify-center">ben carson is listening to:</p>
                        </div>
                    </div>
                    <div className="bg-gray-500 rounded-xl">
                        <div className="bg-gray-900 rounded-xl">
                            <img src="/madonna.jpg" className="rounded-xl"></img>
                            <div className="flex justify-between w-full px-4 py-2">
                                <div className="flex flex-col justify-center text-white">
                                    <div className="flex gap-1 py-1">
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-empty.png' className="h-4"></img>
                                    </div>
                                    <h3 className="text-white/88 font-bold text-2xl">Celebration</h3>
                                    <h4 className="text-white/60 font-semibold text-md">Madonna</h4>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <div className="flex flex-row justify-end pt-2">
                                        <img src="/dots.png" className="h-5 w-5"></img>
                                    </div>
                                    <p className="font-semibold text-sm text-white/85">album</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col p-2 bg-gray-500 rounded-xl">
                            <a className="underline text-sm text-white/80">comment</a>
                        </div>
                    </div>
                    <div className="w-full flex justify-end pt-2">
                        <p className="text-xs flex flex-col justify-end pb-[2px]">2 hours ago</p>
                    </div>
                </div>
                <div className="mx-6 sm:w-7/10 sm:mx-auto md:w-3/5 lg:w-full mt-10 lg:mt-0">
                    <div className="flex justify-between px-1">
                        <div className="flex flex-row gap-2 pb-1">
                            <div className="flex flex-col justify-end">
                                <img src="profile-ben.jpg" className="h-6 w-6 rounded-3xl"></img>
                            </div>
                            <p className="font-semibold text-black/90 flex flex-col justify-center">ben carson is listening to:</p>
                        </div>
                    </div>
                    <div className="bg-gray-500 rounded-xl">
                        <div className="bg-gray-900 rounded-xl">
                            <img src="/madonna.jpg" className="rounded-xl"></img>
                            <div className="flex justify-between w-full px-4 py-2">
                                <div className="flex flex-col justify-center text-white">
                                    <div className="flex gap-1 py-1">
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-empty.png' className="h-4"></img>
                                    </div>
                                    <h3 className="text-white/88 font-bold text-2xl">Celebration</h3>
                                    <h4 className="text-white/60 font-semibold text-md">Madonna</h4>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <div className="flex flex-row justify-end pt-2">
                                        <img src="/dots.png" className="h-5 w-5"></img>
                                    </div>
                                    <p className="font-semibold text-sm text-white/85">album</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col p-2 bg-gray-500 rounded-xl">
                            <a className="underline text-sm text-white/80">comment</a>
                            <a className="underline text-sm text-white/80">comment</a>
                            <a className="underline text-sm text-white/80">comment</a>
                            <a className="underline text-sm text-white/80">comment</a>
                            <a className="underline text-sm text-white/80">comment</a>
                        </div>
                    </div>
                    <div className="w-full flex justify-end pt-2">
                        <p className="text-xs flex flex-col justify-end pb-[2px]">2 hours ago</p>
                    </div>
                </div>
                <div className="mx-6 sm:w-7/10 sm:mx-auto md:w-3/5 lg:w-full mt-10 lg:mt-0">
                    <div className="flex justify-between px-1">
                        <div className="flex flex-row gap-2 pb-1">
                            <div className="flex flex-col justify-end">
                                <img src="profile-ben.jpg" className="h-6 w-6 rounded-3xl"></img>
                            </div>
                            <p className="font-semibold text-black/90 flex flex-col justify-center">ben carson is listening to:</p>
                        </div>
                    </div>
                    <div className="bg-gray-500 rounded-xl">
                        <div className="bg-gray-900 rounded-xl">
                            <img src="/madonna.jpg" className="rounded-xl"></img>
                            <div className="flex justify-between w-full px-4 py-2">
                                <div className="flex flex-col justify-center text-white">
                                    <div className="flex gap-1 py-1">
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-empty.png' className="h-4"></img>
                                    </div>
                                    <h3 className="text-white/88 font-bold text-2xl">Celebration</h3>
                                    <h4 className="text-white/60 font-semibold text-md">Madonna</h4>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <div className="flex flex-row justify-end pt-2">
                                        <img src="/dots.png" className="h-5 w-5"></img>
                                    </div>
                                    <p className="font-semibold text-sm text-white/85">album</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col p-2 bg-gray-500 rounded-xl">
                            <a className="underline text-sm text-white/80">comment</a>
                        </div>
                    </div>
                    <div className="w-full flex justify-end pt-2">
                        <p className="text-xs flex flex-col justify-end pb-[2px]">2 hours ago</p>
                    </div>
                </div>
                <div className="mx-6 sm:w-7/10 sm:mx-auto md:w-3/5 lg:w-full mt-10 lg:mt-0">
                    <div className="flex justify-between px-1">
                        <div className="flex flex-row gap-2 pb-1">
                            <div className="flex flex-col justify-end">
                                <img src="profile-ben.jpg" className="h-6 w-6 rounded-3xl"></img>
                            </div>
                            <p className="font-semibold text-black/90 flex flex-col justify-center">ben carson is listening to:</p>
                        </div>
                    </div>
                    <div className="bg-gray-500 rounded-xl">
                        <div className="bg-gray-900 rounded-xl">
                            <img src="/madonna.jpg" className="rounded-xl"></img>
                            <div className="flex justify-between w-full px-4 py-2">
                                <div className="flex flex-col justify-center text-white">
                                    <div className="flex gap-1 py-1">
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-2.png' className="h-4"></img>
                                        <img src='/star-empty.png' className="h-4"></img>
                                    </div>
                                    <h3 className="text-white/88 font-bold text-2xl">Celebration</h3>
                                    <h4 className="text-white/60 font-semibold text-md">Madonna</h4>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <div className="flex flex-row justify-end pt-2">
                                        <img src="/dots.png" className="h-5 w-5"></img>
                                    </div>
                                    <p className="font-semibold text-sm text-white/85">album</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col p-2 bg-gray-500 rounded-xl">
                            <a className="underline text-sm text-white/80">comment</a>
                        </div>
                    </div>
                    <div className="w-full flex justify-end pt-2">
                        <p className="text-xs flex flex-col justify-end pb-[2px]">2 hours ago</p>
                    </div>
                </div>
            </div>
        </>
    );
}
