import React, { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import user from "../../assets/user.png";
import axios from "axios";

const ProfilePicture = ({
  profilePicture,
  userId,
  onUploadSuccess,
  onUploadError,
}) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/upload-profile-picture/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      const imageUrl = response.data.imageUrl;
      onUploadSuccess?.(imageUrl);
    } catch (err) {
      console.error("Upload failed:", err);
      const msg =
        err.response?.data?.message || "Failed to upload profile picture.";
      onUploadError?.(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group w-28 h-28">
      <img
        src={
          profilePicture ||
          user
        }
        alt="Profile"
        className="w-full h-full rounded-full object-cover border-4 border-blue-200 group-hover:border-blue-400 transition-all duration-300 shadow"
      />

      <label
        htmlFor="profile-picture-upload"
        className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1.5 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-lg hover:bg-blue-700"
        title="Change profile picture"
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <UploadCloud className="h-4 w-4" />
        )}
        <input
          id="profile-picture-upload"
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default ProfilePicture;
