
  
  // pages/index.js
  import Link from "next/link";
import { useState } from "react";
  
  const testVideos = [
    {
      id: 1,
      title: "Introduction to Savings",
      thumbnailUrl: "tb1.webp",
      description: "Finkia's Sales Team(Including Mr Oludare Olarewaju( Founder and CEO of Raoatech) ) at Mandilas Shoes Market in Lagos State, Nigeria.",
      url: "https://res.cloudinary.com/dldchwdkn/video/upload/v1735205579/jaqk37xnpewbd958vgj4.mp4",
    },
    {
      id: 2,
      title: "Smart Investment Tips",
      thumbnailUrl: "tb3.webp",
      description: "Finkia (from Raoatech) : Some Team's Members in Sales Strategy Session.",
      url: "https://res.cloudinary.com/dldchwdkn/video/upload/v1735244767/sntj4fkgxymukfmztmss.mp4",
    },
    {
      id: 3,
      title: "Budgeting for Beginners",
      thumbnailUrl: "/tb2.webp",
      description: "Finkia (from Raoatech) : AI-Powered Photo Editor",
      url: "https://res.cloudinary.com/dldchwdkn/video/upload/v1735246566/feacgp0ovsgctvdbefvh.mp4",
    },
    
  ];
  
  export default function Home() {
    const [selectedVideo, setSelectedVideo] = useState<null | typeof testVideos[0]>(null);
  
    return (
      <div className="">

        <header className="bg-white ">
          <div className="container mx-auto flex justify-between items-center py-2 px-6">
            {/* <h1 className="text-xl font-bold text-[#EAAB40] underline">Savings</h1> */}
            {/* <div className="space-x-4">
              <Link href={'/signup'}>
              <button className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Sign Up</button>
              </Link>
              
              <Link href={'/signin'}>
              <button className="px-4 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50">Sign In</button>
              </Link>
              
            </div> */}
          </div>
        </header>
  
        <main className="container mx-auto py-4 px-6">
  {selectedVideo && (
    <div className="mb-8">
      <div className="relative w-full h-0 pb-[56.25%]">
        {/* Cloudinary Video Embed */}
        <video
          src={selectedVideo.url}
          title={selectedVideo.title}
          controls
          className="absolute top-0 left-0 w-full h-full"
        ></video>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={() => setSelectedVideo(null)}
      >
        Close Video
      </button>
    </div>
  )}

<div className="flex overflow-x-auto space-x-6">
  {testVideos.map((video) => (
    <div
      key={video.id}
      className="flex-none bg-white shadow rounded-lg w-1/3"
      style={{ minWidth: "33.333%" }}
    >
      <div
        className="relative w-full h-40 bg-black cursor-pointer"
        onClick={() => setSelectedVideo(video)}
      >
        {/* Cloudinary Thumbnail */}
        <img
          src={video.thumbnailUrl} // Replace with the Cloudinary thumbnail URL for the video
          alt={video.title}
          className="w-full h-full object-cover"
        />
        {/* Video Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9.5 7.5v9l7-4.5-7-4.5z"></path>
          </svg>
        </div>
      </div>
      <div className="p-4">
        {/* Video Description */}
        <p className="text-gray-600 text-sm mt-2">{video.description}</p>
      </div>
    </div>
  ))}
</div>

</main>


{/* <main className="container mx-auto py-4 px-6">
  <div className="flex overflow-x-auto space-x-6">
    {testVideos.map((video) => (
      <div
        key={video.id}
        className="flex-none bg-white shadow rounded-lg w-1/3"
        style={{ minWidth: "33.333%" }}
      >
        <div
          className="relative w-full h-40 bg-black cursor-pointer"
          onClick={() => window.open(`https://www.youtube.com/watch?v=${video.url.split("v=")[1]}`, "_blank")}
        >
          <img
            src={`https://img.youtube.com/vi/${video.url.split("v=")[1]}/hqdefault.jpg`}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          {/* <h2 className="text-lg font-semibold">{video.title}</h2> */}
          {/* <p className="text-gray-600 text-sm mt-2">{video.description}</p>
        </div>
      </div>
    ))}
  </div>
</main>  */}

      </div>
    );
  }
  

  