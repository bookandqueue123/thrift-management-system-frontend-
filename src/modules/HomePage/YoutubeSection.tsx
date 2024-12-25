
  
  // pages/index.js
  import Link from "next/link";
import { useState } from "react";
  
  const testVideos = [
    {
      id: 1,
      title: "Introduction to Savings",
      description: "Finkia's Sales Team(Including Mr Oludare Olarewaju( Founder and CEO of Raoatech) ) at Mandilas Shoes Market in Lagos State, Nigeria.",
      url: "https://youtu.be/lV8LDtNY_vw",
    },
    {
      id: 2,
      title: "Smart Investment Tips",
      description: "Finkia (from Raoatech) : Some Team's Members in Sales Strategy Session.",
      url: "https://youtu.be/-SXQzBruX4c",
    },
    {
      id: 3,
      title: "Budgeting for Beginners",
      description: "Finkia (from Raoatech) : AI-Powered Photo Editor",
      url: "https://youtu.be/weQBImlJHGoo0zq",
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
  
        {/* <main className="container mx-auto py-4 px-6">
          {selectedVideo && (
            <div className="mb-8">
              <div className="relative w-full h-0 pb-[56.25%]">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.url.split("v=")[1]}`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
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

<main className="container mx-auto py-4 px-6">
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
          <p className="text-gray-600 text-sm mt-2">{video.description}</p>
        </div>
      </div>
    ))}
  </div>
</main>

      </div>
    );
  }
  

  