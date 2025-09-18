import { useState } from "react";
import { Star } from "lucide-react";

export default function NewSong() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [songSelect, setSongSelect] = useState(0);
    const [advancedSettings, setAdvancedSettings] = useState(0);
    const [commentsEnabled, setCommentsEnabled] = useState(false);
    const [reviewVisible, setReviewVisible] = useState(false);

    const handleSongSelection = () => {
        setSongSelect(prev => !prev);
    };

    const handleAdvancedSettings = () => {
        setAdvancedSettings(prev => !prev);
    };

    return (
        <>
            <div className="mt-16 mx-3">
                <button onClick={handleSongSelection}>button</button>
                <div className={`pb-3 ${songSelect ? 'hidden pointer-events-none' : 'visible'}`}>
                    <input name='search' placeholder="search songs" className="bg-gray-300 w-full py-1 px-2">
                    </input>
                </div>
                <div className={`flex gap-2 items-center pb-3 ${songSelect ? 'visible' : 'hidden pointer-events-none'}`}>
                    <img src='/madonna.jpg' className="h-14 rounded-xl"></img>
                    <div>
                        <p className="font-bold text-lg">Like a Prayer</p>
                        <p className="text-black/70 font-medium">Madonna</p>
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
                <textarea placeholder="comments" className={`border-1 rounded-xl border-gray-300 w-full mt-4 px-2 py-1 h-30 focus:outline-none focus:ring-0 ${songSelect ? 'visible' : 'hidden pointer-events-none'}`}></textarea>

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

                <button className={`bg-gray-400 px-3 py-1 rounded-lg font-medium mt-2 ${songSelect ? 'visible' : 'hidden pointer-events-none'}`}>
                    post
                </button>
            </div>
        </>
    );
}
