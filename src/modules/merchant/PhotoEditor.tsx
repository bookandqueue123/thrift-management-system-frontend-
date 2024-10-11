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

  const shareImage = (url: any) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this image!",
          url: url,
        })
        .then(() => console.log("Share successful"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert("Image URL copied to clipboard!");
        })
        .catch((err) => {
          console.error("Could not copy URL: ", err);
        });
    }
  };
  const downloadImage = async (imageUrl: any) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "downloaded-image.jpg"; // You can set a custom filename with an extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the DOM
    } catch (error) {
      console.error("Image download failed", error);
    }
  };

  return (
    <div>
      <div className="container mx-auto rounded-lg bg-gray-100 p-6 shadow-lg">
        <div className="mb-6 text-center">
          <p className="text-4xl font-bold text-ajo_offWhite text-opacity-80">
            AI-Powered Image Editor
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-4">
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              className="w-full rounded-md border border-gray-300 p-2"
            />
            <div className="image-previews flex flex-wrap gap-4">
              {selectedImages.map((image, index) => (
                <div
                  key={index}
                  className="relative h-36 w-36 overflow-hidden rounded-md bg-white shadow-md"
                >
                  <Image
                    width={150}
                    height={150}
                    src={image.preview}
                    alt={`Preview ${index}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white transition duration-200 hover:bg-red-600"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <label className="flex items-center justify-between">
              Upload Background Image:
              <input
                type="file"
                name="bgImage"
                accept="image/*"
                onChange={handleBgImageSelect}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </label>
            {bgImage && (
              <div className="relative h-36 w-36 overflow-hidden rounded-md bg-white shadow-md">
                <Image
                  width={150}
                  height={150}
                  src={bgImage.preview}
                  alt="Background Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          {/* <div className="flex flex-col space-y-2">
            <label>
              Add Text:
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </label>

            <label className="flex items-center">
              Add Shadow:
              <input
                type="checkbox"
                checked={shadow}
                onChange={() => setShadow((prev) => !prev)}
                className="ml-2 h-5 w-5"
              />
            </label>

            <label className="flex items-center">
              Expand Photo:
              <input
                type="checkbox"
                checked={expand}
                onChange={() => setExpand((prev) => !prev)}
                className="ml-2 h-5 w-5"
              />
            </label>
          </div> */}

          <button
            type="submit"
            className={`w-full rounded-md bg-blue-600 p-3 text-white transition duration-200 hover:bg-blue-700 ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Upload"}
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-semibold">Uploaded Images:</h2>
          {uploadedImages.foreground && (
            <div className="mt-4 flex flex-col items-center">
              <Image
                src={uploadedImages.foreground}
                alt="Foreground"
                width={200}
                height={200}
                className="rounded-md shadow-md"
              />
              <p>Foreground Image</p>

              {/* Download and Share Buttons */}
              <div className="mt-2 flex space-x-4">
                <button
                  onClick={() => downloadImage(uploadedImages.foreground)}
                  className="rounded-md bg-green-500 p-2 text-white transition duration-200 hover:bg-green-600"
                >
                  Download
                </button>
                <button
                  onClick={() => shareImage(uploadedImages.foreground)}
                  className="rounded-md bg-blue-500 p-2 text-white transition duration-200 hover:bg-blue-600"
                >
                  Share
                </button>
              </div>
            </div>
          )}

          {uploadedImages.background && (
            <div className="mt-4 flex flex-col items-center">
              <Image
                src={uploadedImages.background}
                alt="Background"
                width={200}
                height={200}
                className="rounded-md shadow-md"
              />
              <p>Background Image</p>

              {/* Download and Share Buttons */}
              <div className="mt-2 flex space-x-4">
                <button
                  onClick={() => downloadImage(uploadedImages.foreground)}
                  className="rounded-md bg-green-500 p-2 text-white transition duration-200 hover:bg-green-600"
                >
                  Download
                </button>

                <button
                  onClick={() => shareImage(uploadedImages.background)}
                  className="duration=200 rounded-md bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                >
                  Share
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
