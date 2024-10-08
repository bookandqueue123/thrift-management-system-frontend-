"use client";
import { apiUrl } from "@/api/hooks/useAuth";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

type ImagePreview = {
  file: File;
  preview: string;
};
type UploadedImages = {
  [key: string]: string[]; // Each key is a string, and the value is an array of image URLs (strings)
};

const ImageUpload = () => {
  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImages>({});

  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Check if files are present
    if (!event.target.files) return;

    // Convert FileList to an array of File objects
    const files: File[] = Array.from(event.target.files);

    // Create previews for each file
    const imagePreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file as File), // Assert file as File
    }));

    // Update selected images state
    setSelectedImages((prev) => [...prev, ...imagePreviews]);
  };

  // Remove selected image from preview
  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
  };

  // Handle form submission to send images to backend
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const formData = new FormData();

    // Append selected images to FormData
    selectedImages.forEach(({ file }) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(`${apiUrl}api/image-editor`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Store the processed images returned from the backend
      setUploadedImages(response.data.images);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleImageSelect}
        />
        <div className="image-previews">
          {selectedImages.map((image, index) => (
            <div key={index} className="image-preview">
              <Image
                width={150}
                height={150}
                src={image.preview}
                alt={`Preview ${index}`}
                className="uploaded-img"
              />
              <button type="button" onClick={() => removeImage(index)}>
                X
              </button>
            </div>
          ))}
        </div>
        <button type="submit">Send</button>
      </form>

      {/* Display uploaded images after processing */}
      {Object.keys(uploadedImages).length > 0 && (
        <div className="uploaded-images">
          <h3>Processed Images:</h3>
          {Object.keys(uploadedImages).map((field) => (
            <div key={field}>
              {uploadedImages[field].map((url: string, idx: number) => (
                <Image
                  width={150}
                  height={150}
                  key={idx}
                  src={url}
                  alt={`Processed ${field} ${idx}`}
                  className="processed-img"
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
