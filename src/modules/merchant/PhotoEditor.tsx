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
  foreground?: string;
  background?: string | null;
};

const ImageUpload = () => {
  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImages>({});
  const [bgImage, setBgImage] = useState<ImagePreview | null>(null);
  const [text, setText] = useState<string>("");
  const [shadow, setShadow] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle multiple image selection for normal images
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files: File[] = Array.from(event.target.files);
    const imagePreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages((prev) => [...prev, ...imagePreviews]);
  };

  // Handle background image selection
  const handleBgImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0]; // Only one background image is allowed
    const bgImagePreview = {
      file,
      preview: URL.createObjectURL(file),
    };
    setBgImage(bgImagePreview);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData();

    // Append normal images
    selectedImages.forEach(({ file }) => {
      formData.append("images", file);
    });

    // Append background image if it exists
    if (bgImage) {
      formData.append("bgImage", bgImage.file);
    }

    // Append optional fields
    if (text) formData.append("text", text);
    formData.append("shadow", shadow ? "true" : "false");
    formData.append("expand", expand ? "true" : "false");

    try {
      const response = await axios.post(`${apiUrl}api/image-editor`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update the uploadedImages state with the foreground and background image URLs
      setUploadedImages({
        foreground: response.data.images, // Foreground image
        background: response.data.background, // Background image (optional)
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error uploading images:", error);
    }
  };

  console.log(uploadedImages);

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

        <div>
          <label>
            Upload Background Image:
            <input
              type="file"
              name="bgImage"
              accept="image/*"
              onChange={handleBgImageSelect}
            />
          </label>
          {bgImage && (
            <div>
              <Image
                width={150}
                height={150}
                src={bgImage.preview}
                alt="Background Preview"
                className="bg-image-preview"
              />
            </div>
          )}
        </div>

        <div>
          <label>
            Add Text:
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text"
            />
          </label>
        </div>

        <div>
          <label>
            Add Shadow:
            <input
              type="checkbox"
              checked={shadow}
              onChange={() => setShadow((prev) => !prev)}
            />
          </label>
        </div>

        <div>
          <label>
            Expand Photo:
            <input
              type="checkbox"
              checked={expand}
              onChange={() => setExpand((prev) => !prev)}
            />
          </label>
        </div>

        <button type="submit">{isLoading ? "Loading..." : "Upload"}</button>
      </form>

      <div>
        <h2>Uploaded Images:</h2>
        {uploadedImages.foreground && (
          <div>
            <Image
              src={uploadedImages.foreground}
              alt="Foreground"
              width={200}
              height={200}
            />
            <p>Foreground Image</p>
          </div>
        )}
        {uploadedImages.background && (
          <div>
            <Image
              src={uploadedImages.background}
              alt="Background"
              width={200}
              height={200}
            />
            <p>Background Image</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
