// "use client";
// import { apiUrl } from "@/api/hooks/useAuth";
// import axios from "axios";
// import Image from "next/image";
// import { useState } from "react";

// type ImagePreview = {
//   file: File;
//   preview: string;
// };
// type UploadedImages = {
//   foreground?: string;
//   background?: string | null;
// };

// const ImageUpload = () => {
//   const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
//   const [uploadedImages, setUploadedImages] = useState<UploadedImages>({});
//   const [bgImage, setBgImage] = useState<ImagePreview | null>(null);
//   const [text, setText] = useState<string>("");
//   const [shadow, setShadow] = useState<boolean>(false);
//   const [expand, setExpand] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   // Handle multiple image selection for normal images
//   const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (!event.target.files) return;
//     const files: File[] = Array.from(event.target.files);
//     const imagePreviews = files.map((file) => ({
//       file,
//       preview: URL.createObjectURL(file),
//     }));
//     setSelectedImages((prev) => [...prev, ...imagePreviews]);
//   };

//   // Handle background image selection
//   const handleBgImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (!event.target.files) return;
//     const file = event.target.files[0]; // Only one background image is allowed
//     const bgImagePreview = {
//       file,
//       preview: URL.createObjectURL(file),
//     };
//     setBgImage(bgImagePreview);
//   };

//   const removeImage = (index: number) => {
//     const newImages = selectedImages.filter((_, i) => i !== index);
//     setSelectedImages(newImages);
//   };

//   const handleSubmit = async (event: { preventDefault: () => void }) => {
//     setIsLoading(true);
//     event.preventDefault();
//     const formData = new FormData();

//     // Append normal images
//     selectedImages.forEach(({ file }) => {
//       formData.append("images", file);
//     });

//     // Append background image if it exists
//     if (bgImage) {
//       formData.append("bgImage", bgImage.file);
//     }

//     // Append optional fields
//     if (text) formData.append("text", text);
//     formData.append("shadow", shadow ? "true" : "false");
//     formData.append("expand", expand ? "true" : "false");

//     try {
//       const response = await axios.post(`${apiUrl}api/image-editor`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       // Update the uploadedImages state with the foreground and background image URLs
//       setUploadedImages({
//         foreground: response.data.images, // Foreground image
//         background: response.data.background, // Background image (optional)
//       });
//       setIsLoading(false);
//     } catch (error) {
//       setIsLoading(false);
//       console.error("Error uploading images:", error);
//     }
//   };

//   const shareImage = (url: any) => {
//     if (navigator.share) {
//       navigator
//         .share({
//           title: "Check out this image!",
//           url: url,
//         })
//         .then(() => console.log("Share successful"))
//         .catch((error) => console.error("Error sharing:", error));
//     } else {
//       // Fallback for browsers that don't support the Web Share API
//       navigator.clipboard
//         .writeText(url)
//         .then(() => {
//           alert("Image URL copied to clipboard!");
//         })
//         .catch((err) => {
//           console.error("Could not copy URL: ", err);
//         });
//     }
//   };
//   const downloadImage = async (imageUrl: any) => {
//     try {
//       const response = await fetch(imageUrl);
//       const blob = await response.blob();
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = "downloaded-image.jpg"; // You can set a custom filename with an extension
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link); // Clean up the DOM
//     } catch (error) {
//       console.error("Image download failed", error);
//     }
//   };

//   return (
//     <div>
//       <div className="container mx-auto rounded-lg bg-gray-100 p-6 shadow-lg">
//         <div className="mb-6 text-center">
//           <p className="text-dark text-4xl font-bold text-opacity-80">
//             AI-Powered Image Editor
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="flex flex-col space-y-4">
//             <input
//               type="file"
//               name="images"
//               multiple
//               accept="image/*"
//               onChange={handleImageSelect}
//               className="w-full rounded-md border border-gray-300 p-2"
//             />
//             <div className="image-previews flex flex-wrap gap-4">
//               {selectedImages.map((image, index) => (
//                 <div
//                   key={index}
//                   className="relative h-36 w-36 overflow-hidden rounded-md bg-white shadow-md"
//                 >
//                   <Image
//                     width={150}
//                     height={150}
//                     src={image.preview}
//                     alt={`Preview ${index}`}
//                     className="h-full w-full object-cover"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(index)}
//                     className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white transition duration-200 hover:bg-red-600"
//                   >
//                     X
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex flex-col space-y-4">
//             <label className="flex items-center justify-between">
//               Upload Background Image:
//               <input
//                 type="file"
//                 name="bgImage"
//                 accept="image/*"
//                 onChange={handleBgImageSelect}
//                 className="w-full rounded-md border border-gray-300 p-2"
//               />
//             </label>
//             {bgImage && (
//               <div className="relative h-36 w-36 overflow-hidden rounded-md bg-white shadow-md">
//                 <Image
//                   width={150}
//                   height={150}
//                   src={bgImage.preview}
//                   alt="Background Preview"
//                   className="h-full w-full object-cover"
//                 />
//               </div>
//             )}
//           </div>

//           <button
//             type="submit"
//             className={`w-full rounded-md bg-blue-600 p-3 text-white transition duration-200 hover:bg-blue-700 ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
//             disabled={isLoading}
//           >
//             {isLoading ? "Loading..." : "Upload"}
//           </button>
//         </form>

//         <div className="mt-8">
//           <h2 className="text-xl font-semibold">Uploaded Image:</h2>
//           {uploadedImages.foreground && (
//             <div className="mt-4 flex flex-col items-center">
//               <Image
//                 src={uploadedImages.foreground}
//                 alt="Foreground"
//                 width={200}
//                 height={200}
//                 className="rounded-md shadow-md"
//               />
//               <p>Image</p>

//               {/* Download and Share Buttons */}
//               <div className="mt-2 flex space-x-4">
//                 <button
//                   onClick={() => downloadImage(uploadedImages.foreground)}
//                   className="rounded-md bg-green-500 p-2 text-white transition duration-200 hover:bg-green-600"
//                 >
//                   Download
//                 </button>
//                 <button
//                   onClick={() => shareImage(uploadedImages.foreground)}
//                   className="rounded-md bg-blue-500 p-2 text-white transition duration-200 hover:bg-blue-600"
//                 >
//                   Share
//                 </button>
//               </div>
//             </div>
//           )}

//           {uploadedImages.background && (
//             <div className="mt-4 flex flex-col items-center">
//               <Image
//                 src={uploadedImages.background}
//                 alt="Background"
//                 width={200}
//                 height={200}
//                 className="rounded-md shadow-md"
//               />
//               <p>Background Image</p>

//               {/* Download and Share Buttons */}
//               <div className="mt-2 flex space-x-4">
//                 <button
//                   onClick={() => downloadImage(uploadedImages.foreground)}
//                   className="rounded-md bg-green-500 p-2 text-white transition duration-200 hover:bg-green-600"
//                 >
//                   Download
//                 </button>

//                 <button
//                   onClick={() => shareImage(uploadedImages.background)}
//                   className="duration=200 rounded-md bg-blue-500 p-2 text-white transition hover:bg-blue-600"
//                 >
//                   Share
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImageUpload;
"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "../../styles/selfie-generator.module.css";

export default function SelfieGenerator() {
  const photoroomKey = process.env.PHOTOROOM_API_KEY;
  const [apiKey, setApiKey] = useState(photoroomKey || "");
  const [overlayText, setOverlayText] = useState("");
  const [scaleFactor, setScaleFactor] = useState(1);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [userOffsetX, setUserOffsetX] = useState(0);
  const [userOffsetY, setUserOffsetY] = useState(0);
  const [segmentedPhoto, setSegmentedPhoto] = useState<HTMLImageElement | null>(
    null,
  );
  const [backgroundPhoto, setBackgroundPhoto] =
    useState<HTMLImageElement | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // New loading state

  const imageInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);

  const moveStep = 10;

  const handleImageUpload = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true when the form is submitted

    // Use optional chaining to safely access the files array
    const imageFile = imageInputRef.current?.files?.[0];
    if (!imageFile) {
      setLoading(false); // Reset loading state if no image file is selected
      return;
    }

    try {
      const image = await removeBackground(); // Now this will be HTMLImageElement

      const backgroundFile = backgroundInputRef.current?.files?.[0];
      const backgroundImage = backgroundFile
        ? await loadImage(backgroundFile) // This will also return HTMLImageElement
        : null;

      setSegmentedPhoto(image); // image is HTMLImageElement
      setBackgroundPhoto(backgroundImage); // backgroundImage can be HTMLImageElement or null
      updateImage(image, backgroundImage); // Draw image on upload
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false); // Reset loading state after processing is complete
    }
  };

  const removeBackground = async () => {
    if (
      !imageInputRef.current ||
      !imageInputRef.current.files ||
      imageInputRef.current.files.length === 0
    ) {
      throw new Error("No file selected");
    }

    const formData = new FormData();
    formData.append("image_file", imageInputRef.current.files[0]);
    formData.append("format", "png");

    const response = await fetch("https://sdk.photoroom.com/v1/segment", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to remove background");

    const blob = await response.blob();
    return await loadImage(blob);
  };

  const loadImage = (file: Blob): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result;

        if (typeof result === "string") {
          const img = new Image();
          img.src = result;

          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("Failed to load image"));
        } else {
          reject(new Error("FileReader did not return a valid string"));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const updateImage = async (
    image: HTMLImageElement,
    backgroundImage: HTMLImageElement | null,
  ) => {
    if (!image) return;
    const canvas = resultCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const finalImage = await drawImageWithOverlay(image, backgroundImage);
    if (!finalImage) {
      console.error("finalImage is undefined");
      return;
    }
    canvas.width = finalImage.width;
    canvas.height = finalImage.height;
    ctx.drawImage(finalImage, 0, 0);

    finalImage.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        console.error("Failed to create blob from finalImage");
      }
    });
  };

  const drawImageWithOverlay = async (
    image: CanvasImageSource,
    backgroundImage: CanvasImageSource | null,
  ) => {
    const canvas = document.createElement("canvas");
    const canvasHeight = 1920;
    const canvasWidth = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    if (!backgroundImage) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    } else {
      ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
    }

    const img = image as HTMLImageElement | HTMLCanvasElement;
    const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
    const newScaledWidth = img.width * scale * scaleFactor;
    const newScaledHeight = img.height * scale * scaleFactor;

    const offsetX = (canvasWidth - newScaledWidth) / 2 + userOffsetX;
    const offsetY = (canvasHeight - newScaledHeight) / 2 + userOffsetY;

    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate(rotationDegrees * (Math.PI / 180));
    ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
    ctx.drawImage(img, offsetX, offsetY, newScaledWidth, newScaledHeight);
    ctx.restore();

    const fontSize = 58;
    const textMarginBottom = 50;

    ctx.font = `bold ${fontSize}px 'DM Sans', sans-serif`;
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";

    const text = overlayText;
    const textX = canvasWidth / 2;
    const textY = canvasHeight - textMarginBottom;

    ctx.fillText(text, textX, textY);

    return canvas;
  };

  useEffect(() => {
    if (segmentedPhoto) {
      updateImage(segmentedPhoto, backgroundPhoto);
    }
  }, [scaleFactor, rotationDegrees, userOffsetX, userOffsetY]);

  const handleShare = async (url: string | URL | Request) => {
    if (navigator.share) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], "selfie.png", { type: blob.type });

        await navigator.share({
          title: "Check out my AI-Generated Selfie!",
          text: "Here's a cool selfie I made with this AI Photo Editor!",
          files: [file],
        });
        console.log("Share successful");
      } catch (error) {
        console.error("Error sharing", error);
      }
    } else {
      alert("Web Share API is not supported in your browser.");
    }
  };

  return (
    <div className={styles.body}>
      <h1 className={styles.h1}>AI Photo Editor</h1>
      <div className={styles.editor_container}>
        <form onSubmit={handleImageUpload} className={styles.upload_form}>
          <div>
            <label>Upload Image</label>
            <br />
            <input
              className="input w-full max-w-xs rounded-lg border border-gray-300 p-4 placeholder-gray-400 shadow-md transition duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="file"
              accept="image/*"
              ref={imageInputRef}
            />
          </div>

          <div className="my-2">
            <label>Upload background image</label>
            <br />
            <input
              className="input w-full max-w-xs rounded-lg border border-gray-300 p-4 placeholder-gray-400 shadow-md transition duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="file"
              accept="image/*"
              ref={backgroundInputRef}
            />
          </div>

          <label>Add Text</label>
          <br />
          <input
            className="w-full max-w-xs rounded-lg border border-gray-300 p-4 placeholder-gray-400 shadow-md transition duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter text overlay here..."
            maxLength={46}
            value={overlayText}
            onChange={(e) => setOverlayText(e.target.value)}
          />
          <br />
          <label>Scale</label>
          <br />
          <input
            className={styles.input_range}
            type="range"
            min="0.1"
            max="3"
            step="0.01"
            value={scaleFactor}
            onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
          />
          <br />
          <label>Rotation (degrees)</label>
          <br />
          <input
            className={styles.input_range}
            type="range"
            min="-180"
            max="180"
            step="1"
            value={rotationDegrees}
            onChange={(e) => setRotationDegrees(parseFloat(e.target.value))}
          />
          <br />
          <div className={styles.arrow_buttons}>
            <div className={styles.arrow_buttons_container}>
              <div className={styles.arrow_up_container}>
                <button
                  className={styles.arrow_button}
                  type="button"
                  onClick={() => setUserOffsetY(userOffsetY - moveStep)}
                >
                  &uarr;
                </button>
              </div>
              <div className={styles.arrow_middle_container}>
                <button
                  className={styles.arrow_button}
                  type="button"
                  onClick={() => setUserOffsetX(userOffsetX - moveStep)}
                >
                  &larr;
                </button>
                <button
                  className={styles.arrow_button}
                  type="button"
                  onClick={() => setUserOffsetY(userOffsetY + moveStep)}
                >
                  &darr;
                </button>
                <button
                  className={styles.arrow_button}
                  type="button"
                  onClick={() => setUserOffsetX(userOffsetX + moveStep)}
                >
                  &rarr;
                </button>
              </div>
            </div>
          </div>
          <br />
          <button
            className={styles.button_submit}
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Generate"}
          </button>
        </form>
        <canvas className={styles.result_canvas} ref={resultCanvasRef} />
      </div>

      {downloadUrl && (
        <>
          <Link
            className={styles.download_button}
            href={downloadUrl}
            download="Image.png"
            target="_blank"
            rel="noreferrer"
          >
            <button>Download Image</button>
          </Link>
          <span className="ml-2 cursor-pointer rounded border-none bg-ajo_blue px-4 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-green-700">
            <button onClick={() => handleShare(downloadUrl)}>
              Share Image
            </button>
          </span>
        </>
      )}
    </div>
  );
}
