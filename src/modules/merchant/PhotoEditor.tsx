"use client";
import { apiUrl } from "@/api/hooks/useAuth";
import axios from "axios";
import { useState } from "react";

const PhotoEditor = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(`${apiUrl}api/image-editor`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadedImages(response.data);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Upload Images</h1>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Upload
      </button>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {uploadedImages.map((image, index) => (
          <div key={index} className="border p-4">
            <img src={image.imageUrl} alt="Original" className="mb-2" />
            <img src={image.backgroundRemovedUrl} alt="Background Removed" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoEditor;
