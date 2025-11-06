import React, { useEffect, useRef, useState } from "react";

export default function USettings() {
  const [avatar, setAvatar] = useState({
    file: null,
    preview: "",
  });

  const fileInputRef = useRef(null);

  // Clean up object URLs when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (avatar.preview) URL.revokeObjectURL(avatar.preview);
    };
  }, [avatar.preview]);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const under5MB = file.size <= 5 * 1024 * 1024;

    if (!isImage) {
      alert("Please choose an image file (PNG, JPG, GIF, or WEBP).");
      e.target.value = "";
      return;
    }
    if (!under5MB) {
      alert("Image too large. Please use a file under 5MB.");
      e.target.value = "";
      return;
    }

    // Revoke previous preview
    if (avatar.preview) URL.revokeObjectURL(avatar.preview);

    const preview = URL.createObjectURL(file);
    setAvatar({ file, preview });
  };

  const removeAvatar = () => {
    if (avatar.preview) URL.revokeObjectURL(avatar.preview);
    setAvatar({ file: null, preview: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!avatar.file) {
      alert("Please choose a profile picture first.");
      return;
    }

    // Build payload for demo
    const payload = new FormData();
    payload.append("avatar", avatar.file);

    console.log("Uploading avatar (demo):", {
      name: avatar.file.name,
      size: avatar.file.size,
      type: avatar.file.type,
    });

    alert("Profile picture saved (demo). Check console for details.");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-[500px] text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Profile Picture
        </h1>

        <div className="flex flex-col items-center gap-5 mb-8">
          <div className="w-32 h-32 rounded-full bg-gray-100 border border-gray-300 overflow-hidden flex items-center justify-center">
            {avatar.preview ? (
              <img
                src={avatar.preview}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-14 h-14 text-gray-400"
                aria-hidden="true"
              >
                <path d="M12 12c2.76 0 5-2.24 5-5S14.76 2 12 2 7 4.24 7 7s2.24 5 5 5zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
              </svg>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={openFilePicker}
              className="px-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Change Picture
            </button>
            <button
              type="button"
              onClick={removeAvatar}
              disabled={!avatar.file}
              className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove
            </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-2 rounded-full font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Save Picture
        </button>
      </div>
    </div>
  );
}
