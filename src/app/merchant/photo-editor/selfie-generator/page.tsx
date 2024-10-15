"use client";
// import { useRef, useState } from "react";
// import styles from "../../../../styles/selfie-generator.module.css";
// export default function SelfieGenerator() {
//   const [apiKey, setApiKey] = useState("");
//   const [overlayText, setOverlayText] = useState("");
//   const [scaleFactor, setScaleFactor] = useState(1);
//   const [rotationDegrees, setRotationDegrees] = useState(0);
//   const [userOffsetX, setUserOffsetX] = useState(0);
//   const [userOffsetY, setUserOffsetY] = useState(0);
//   const [segmentedPhoto, setSegmentedPhoto] = useState(null);

//   const imageInputRef = useRef(null);
//   const resultCanvasRef = useRef(null);

//   const moveStep = 10;

//   const handleImageUpload = async (event) => {
//     event.preventDefault();
//     if (!imageInputRef.current.files[0]) return;

//     const image = await removeBackground();
//     setSegmentedPhoto(image);
//     updateImage(image);
//   };

//   const removeBackground = async () => {
//     const formData = new FormData();
//     formData.append("image_file", imageInputRef.current.files[0]);
//     formData.append("format", "png");

//     const response = await fetch("https://sdk.photoroom.com/v1/segment", {
//       method: "POST",
//       headers: {
//         "X-Api-Key": apiKey,
//       },
//       body: formData,
//     });

//     if (!response.ok) throw new Error("Failed to remove background");

//     const blob = await response.blob();
//     return await loadImage(blob);
//   };

//   const loadImage = (file) => {
//     return new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const img = new Image();
//         img.src = event.target.result;
//         img.onload = () => resolve(img);
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const updateImage = async (image) => {
//     if (!image) return;
//     const canvas = resultCanvasRef.current;
//     const ctx = canvas.getContext("2d");
//     const finalImage = await drawImageWithOverlay(image);

//     canvas.width = finalImage.width;
//     canvas.height = finalImage.height;
//     ctx.drawImage(finalImage, 0, 0);
//   };

//   const drawImageWithOverlay = async (image) => {
//     // Add your overlay image logic here
//     const canvas = document.createElement("canvas");
//     const canvasHeight = 1920;
//     const canvasWidth = 1080;

//     const ctx = canvas.getContext("2d");
//     canvas.width = canvasWidth;
//     canvas.height = canvasHeight;

//     // Draw the background and overlay image logic here
//     const scale = Math.min(
//       canvasWidth / image.width,
//       canvasHeight / image.height,
//     );
//     const newScaledWidth = image.width * scale * scaleFactor;
//     const newScaledHeight = image.height * scale * scaleFactor;

//     const offsetX = (canvasWidth - newScaledWidth) / 2 + userOffsetX;
//     const offsetY = (canvasHeight - newScaledHeight) / 2 + userOffsetY;

//     ctx.save();
//     ctx.translate(canvasWidth / 2, canvasHeight / 2);
//     ctx.rotate(rotationDegrees * (Math.PI / 180));
//     ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
//     ctx.drawImage(image, offsetX, offsetY, newScaledWidth, newScaledHeight);
//     ctx.restore();

//     return canvas;
//   };

//   return (
//     <div className={styles.body}>
//       <h1 className={styles.h1}>Selfie Generator</h1>
//       <form onSubmit={handleImageUpload} className="upload-form">
//         <input
//           className="input"
//           type="text"
//           placeholder="Enter your PhotoRoom API key here..."
//           value={apiKey}
//           onChange={(e) => setApiKey(e.target.value)}
//         />
//         <br />

//         <input
//           className="input"
//           type="file"
//           accept="image/*"
//           ref={imageInputRef}
//         />
//         <br />
//         <label>This person is</label>
//         <br />
//         <input
//           type="text"
//           placeholder="Enter text overlay here..."
//           maxLength={46}
//           value={overlayText}
//           onChange={(e) => setOverlayText(e.target.value)}
//         />
//         <br />
//         <label>Scale</label>
//         <br />
//         <input
//           type="range"
//           min="0.1"
//           max="3"
//           step="0.01"
//           value={scaleFactor}
//           onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
//         />
//         <br />
//         <label>Rotation (degrees)</label>
//         <br />
//         <input
//           type="range"
//           min="-180"
//           max="180"
//           step="1"
//           value={rotationDegrees}
//           onChange={(e) => setRotationDegrees(parseFloat(e.target.value))}
//         />
//         <br />
//         <div className={styles.arrow_buttons}>
//           <div className={styles.arrow_buttons_container}>
//             <div className={styles.arrow_up_container}>
//               <button
//                 className={styles.arrow_button}
//                 type="button"
//                 onClick={() => setUserOffsetY(userOffsetY - moveStep)}
//               >
//                 &uarr;
//               </button>
//             </div>
//             <div className={styles.arrow_middle_container}>
//               <button
//                 className={styles.arrow_button}
//                 type="button"
//                 onClick={() => setUserOffsetX(userOffsetX - moveStep)}
//               >
//                 &larr;
//               </button>
//               <button
//                 className={styles.arrow_button}
//                 type="button"
//                 onClick={() => setUserOffsetY(userOffsetY + moveStep)}
//               >
//                 &darr;
//               </button>
//               <button
//                 className={styles.arrow_button}
//                 type="button"
//                 onClick={() => setUserOffsetX(userOffsetX + moveStep)}
//               >
//                 &rarr;
//               </button>
//             </div>
//           </div>
//         </div>
//         <button className={styles.button_submit} type="submit">
//           Upload
//         </button>
//       </form>

//       <canvas ref={resultCanvasRef}></canvas>
//       {/* <div id="result-container" className={styles.result_container}>
//         <canvas className={styles.result_canvas} ref={resultCanvasRef}></canvas>
//       </div> */}
//     </div>
//   );
// }
"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "../../../../styles/selfie-generator.module.css";

export default function SelfieGenerator() {
  const [apiKey, setApiKey] = useState(
    "sandbox_4f85351787f802157cd36c4817ebdd4a21c13f71",
  );
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

  const imageInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);

  const moveStep = 10;

  const handleImageUpload = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // Use optional chaining to safely access the files array
    const imageFile = imageInputRef.current?.files?.[0];
    if (!imageFile) return;

    const image = await removeBackground(); // Now this will be HTMLImageElement

    const backgroundFile = backgroundInputRef.current?.files?.[0];
    const backgroundImage = backgroundFile
      ? await loadImage(backgroundFile) // This will also return HTMLImageElement
      : null;

    setSegmentedPhoto(image); // image is HTMLImageElement
    setBackgroundPhoto(backgroundImage); // backgroundImage can be HTMLImageElement or null
    updateImage(image, backgroundImage); // Draw image on upload
  };

  const removeBackground = async () => {
    // Ensure imageInputRef and its files are not null
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
    return await loadImage(blob); // Assuming loadImage returns an image or a file
  };

  const loadImage = (file: Blob): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        // Safely access the target and result
        const result = event.target?.result;

        // Check if the result is a string
        if (typeof result === "string") {
          const img = new Image();
          img.src = result;

          img.onload = () => resolve(img); // Resolve with the loaded image
          img.onerror = (error) => reject(new Error("Failed to load image")); // Reject on error
        } else {
          reject(new Error("FileReader did not return a valid string"));
        }
      };

      reader.onerror = (error) => reject(new Error("Failed to read file")); // Handle file read errors

      reader.readAsDataURL(file); // Read the Blob as a Data URL
    });
  };

  const updateImage = async (
    image: HTMLImageElement,
    backgroundImage: HTMLImageElement | null,
  ) => {
    if (!image) return; // Don't proceed if there's no image
    const canvas = resultCanvasRef.current;
    if (!canvas) return; // Check if canvas is available

    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const finalImage = await drawImageWithOverlay(image, backgroundImage);
    if (!finalImage) {
      console.error("finalImage is undefined");
      return; // Exit if finalImage is not valid
    }
    canvas.width = finalImage.width;
    canvas.height = finalImage.height;
    ctx.drawImage(finalImage, 0, 0);

    // Create a downloadable version of the image
    finalImage.toBlob((blob) => {
      if (blob) {
        // Check if blob is not null
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

    // Fill the background with white if no background image is provided
    if (!backgroundImage) {
      ctx.fillStyle = "white"; // Set default background color
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    } else {
      // Draw the uploaded background image
      ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
    }

    // Type guard to ensure image is a type with width and height properties
    const img = image as HTMLImageElement | HTMLCanvasElement;

    // Scale the image to fit the canvas
    const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
    const newScaledWidth = img.width * scale * scaleFactor;
    const newScaledHeight = img.height * scale * scaleFactor;

    const offsetX = (canvasWidth - newScaledWidth) / 2 + userOffsetX;
    const offsetY = (canvasHeight - newScaledHeight) / 2 + userOffsetY;

    // Draw the segmented image (rotated and scaled)
    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate(rotationDegrees * (Math.PI / 180));
    ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
    ctx.drawImage(img, offsetX, offsetY, newScaledWidth, newScaledHeight);
    ctx.restore();

    // Draw horizontal overlay text at the bottom
    const fontSize = 58;
    const textMarginBottom = 50; // Margin from the bottom of the canvas

    ctx.font = `bold ${fontSize}px 'DM Sans', sans-serif`;
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";

    const text = overlayText;
    const textX = canvasWidth / 2;
    const textY = canvasHeight - textMarginBottom;

    // Draw the text horizontally at the bottom
    ctx.fillText(text, textX, textY);

    return canvas;
  };

  // useEffect to redraw the image whenever scaleFactor or rotationDegrees changes
  useEffect(() => {
    if (segmentedPhoto) {
      updateImage(segmentedPhoto, backgroundPhoto);
    }
  }, [scaleFactor, rotationDegrees, userOffsetX, userOffsetY]);

  const handleShare = async (url: string | URL | Request) => {
    if (navigator.share) {
      try {
        // Fetch the image file from the URL
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
      <form onSubmit={handleImageUpload} className="upload-form">
        {/* <div>
          <input
            className="input"
            type="text"
            placeholder="Enter your PhotoRoom API key here..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div> */}
        <br />
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
            accept="image/*" // New input for background image
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
        <button className={styles.button_submit} type="submit">
          Generate Image
        </button>
      </form>
      <canvas className={styles.result_canvas} ref={resultCanvasRef} />
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
