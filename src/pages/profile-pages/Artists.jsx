export default function Artists() {
    return (
        <>
            <div className="mx-6 py-1 sm:max-w-7/8 sm:mx-auto md:max-w-3/4 lg:max-w-5/8">
                <p className="font-medium">12/03/22</p>
                <div className="bg-gray-500 rounded-xl">
                    <div className="flex p-2 gap-2 bg-gray-800 rounded-xl">
                        <img src="/daniel.jpg" className="h-18 rounded-lg" />
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col justify-center text-white">
                                <h3 className="text-white/88 font-bold text-lg">Daniel Caesar</h3>
                            </div>
                            <div className="flex flex-col justify-between">
                                <div className="flex flex-row justify-end">
                                    <img src="/dots.png" className="h-5 w-5"></img>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
