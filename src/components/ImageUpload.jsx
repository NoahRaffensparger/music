import { useState, useRef, useEffect, useContext } from "react";
import UserContext from "../components/UserContext";

export default function ImageUpload({
    onUpload,
    uploadUrl,
    fieldName = "image",
    userId = null,
    maxSizeMB = 5,
    onClose
}) {
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const { user, setUser } = useContext(UserContext);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const componentRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (componentRef.current && !componentRef.current.contains(event.target)) {
                if (onClose) onClose()
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (e) => {
        const img = e.target.files[0];
        if (!img) return;

        const valid = ["image/jpeg", "image/png", "image/webp"];
        if (!valid.includes(img.type)) {
            alert("Invalid file type. Use JPG, PNG, or WebP.");
            return;
        }

        if (img.size > maxSizeMB * 1024 * 1024) {
            alert(`File too large. Max ${maxSizeMB}MB`);
            return;
        }

        setFile(img);
        setPreview(URL.createObjectURL(img));
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append(fieldName, file);
        if (userId) formData.append("userId", userId);
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);

        xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
                setProgress(Math.round((e.loaded / e.total) * 100));
            }
        });

        xhr.onload = () => {
            setUploading(false);
            if (xhr.status === 200 || xhr.status === 201) {
                const response = JSON.parse(xhr.responseText);
                if (onUpload) onUpload(response.user?.image_url || response.imageUrl);
                setPreview(null)
                if (onClose) onClose()
            } else {
                alert("Upload failed");
            }
        };

        xhr.send(formData);
    };

    const handleRemoveImage = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/api/remove-user-image`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: id
                }),
            });

            if (!res.ok) {
                throw new Error(`Failed to update user: ${res.status}`);
            }

            const data = await res.json();
            console.log("User updated", data);
            if (onUpload) onUpload(data.image_url);
            if (onClose) onClose()
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl p-4 w-80 shadow-lg flex flex-col items-center justify-center gap-2" ref={componentRef}>
                {preview && (
                    <div className="flex">
                        <div className="w-3" />
                        <img
                            src={preview}
                            alt="preview"
                            className="w-32 h-32 object-cover rounded-full"
                        />
                        <img src='close2.png' className="h-3" onClick={() => { setPreview(null); }}></img>
                    </div>
                )}
                <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleSelect}
                    className="hidden"
                />
                {!preview && (
                    <label
                        htmlFor="fileInput"
                        className="cursor-pointer bg-gray-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700"
                    >
                        Choose Image
                    </label>
                )}
                {!preview && (
                    <button
                        className="text-red-600 py-1 px-2 rounded-lg border-1 bg-gray-200"
                        onClick={() => handleRemoveImage(user.userId)}
                    >
                        Remove Profile Picture
                    </button>
                )}
                {preview && (
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="bg-gray-600 text-white py-1 px-2 rounded-lg disabled:opacity-50"
                    >
                        {uploading ? "Uploading..." : "Change Profile Picture"}
                    </button>
                )}
                {uploading && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}
            </div>

        </div>
    );
}
