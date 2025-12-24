// components/Carousel.js
import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Carousel = () => {
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Infinite loop
    speed: 500, // Animation speed
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    arrows: true, // Enable navigation arrows
    autoplay: true, // Enable autoplay
    autoplaySpeed: 1000, // Time in milliseconds between slides (3 seconds here)
  };

  const slides = [
    {
      id: 1,
      title: "Slide 1",
      image: "/FINKIA_BANNER1.png", 
    },
    {
      id: 2,
      title: "Slide 2",
      image: "/FINKIA_BANNER2.png",
    },
    {
      id: 3,
      title: "Slide 3",
      image: "/FINKIA_BANNER3.png",
    },
    {
      id: 4,
      title: "Slide 4",
      image: "/FINKIA_BANNER4.png",
    },
  ];

  return (
    <div className="container mx-auto p-4">
     
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="flex justify-center items-center">
            <div className="w-full relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="rounded-md w-full h-full object-cover"
              />
              
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
