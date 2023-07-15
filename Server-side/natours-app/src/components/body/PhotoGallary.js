import React from "react";
import Slider from "react-slick";


export const PhotoGallery = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="photo-gallery">
      {/* <h2>Photo Gallery</h2> */}
      <Slider {...settings}>
        <div className="photo-slide">
          <img src="https://www.natours.dev/img/tours/tour-5-cover.jpg" alt="" />
        </div>
        <div className="photo-slide">
          <img src="https://www.natours.dev/img/tours/tour-5-cover.jpg" alt="" />
        </div>
        
      </Slider>
    </div>
  );
};


