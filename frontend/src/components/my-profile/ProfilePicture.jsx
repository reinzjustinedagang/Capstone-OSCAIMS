import React from "react";
import { UploadCloud } from "lucide-react";

export default function ProfilePicture({ profilePicture, onUpload }) {
  return (
    <div className="relative group">
      <img
        src={profilePicture || "/default-profile.png"}
        alt="Profile"
        className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 group-hover:border-blue-400 transition-colors duration-300"
      />
      <label
        htmlFor="profile-picture-upload"
        className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-md hover:bg-blue-700"
        title="Change profile picture"
      >
        <UploadCloud className="h-5 w-5" />
        <input
          id="profile-picture-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUpload}
        />
      </label>
    </div>
  );
}
