import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../utils/useFetch";
import { PhotoGallery } from "./PhotoGallary";
import { ReviewsSection } from "./ReviewsSection";
import ReactLoading from "react-loading";
import "./Tour.css";
import {
  FaStar,
  FaUserFriends,
  FaMap,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import axiosWrapper from "../utils/axiosWrapper";

export const TourDetails = () => {
  const { id } = useParams();

  const [name, setName] = useState("Tour-name");
  const [rating, setRating] = useState(4.5);
  const [difficulty, setDifficulty] = useState("medium");
  const [images, setImages] = useState([]);
  const [coverImg, setCoverImg] = useState("");
  const [startLocation, setStartLocation] = useState("startLocation");
  const [duration, setDuration] = useState("duration");
  const [desc, setDesc] = useState("desc");
  const [maxGroupSize, setMaxGroupSize] = useState("maxGroupSize");
  const [startDates, setStartDates] = useState("startDates");
  const [reviews, setReviews] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data } = await axiosWrapper.get(`/tours/${id}`);
      let tour = data.doc;
      setLoading(false);
      setName(tour.name);
      setCoverImg(tour.imageCover);
      setDuration(tour.duration);
      setDifficulty(tour.difficulty);
      setImages(tour.images);
      setRating(tour.ratingsAverage);
      setStartLocation(tour.startLocation);
      setDesc(tour.description);
      setMaxGroupSize(tour.maxGroupSize);
      setStartDates(tour.startDates);
      setReviews(tour.reviews);
      setGuides(tour.guides);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <ReactLoading
        type="spinningBubbles"
        color="#0000FF"
        height={100}
        width={50}
      />
    );
  }

  return (
    <div className="tour-container">
      <section className="tour-image">
        <div className="img-layout"></div>
        <div className="image">
          <img src={`/img/tours/${coverImg}`} alt="" />
        </div>
        <div className="tour-info">
          <h1 className="text-img tour-name">{name}</h1>
          <div className="tour-location-duration">
            <div className="icon-text">
              {" "}
              <FaMapMarkerAlt className="icon" />
              <p
                className="tour-location"
                style={{ fontWeight: 700, textTransform: "uppercase" }}
              >
                {startLocation.description}
              </p>
            </div>
            <div className="icon-text">
              <FaClock className="icon" />
              <p
                className="tour-duration"
                style={{ fontWeight: 700, textTransform: "uppercase" }}
              >
                {`${duration} Days`}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="tour-details">
        <div>
          <div className="tour-guides">
            <h2>Guides</h2>
            <ul>
              {guides &&
                guides.map((guide) => {
                  return (
                    <li>
                      <div className="guide-profile">
                        <img src={`/img/users/${guide.photo}`} alt="" />
                      </div>
                      <p className="guide-authority">Tour Guide</p>
                      <p className="guide-name">{guide.name}</p>
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="tour-facts">
            <h2>Tour Facts</h2>
            <ul>
              <li>
                <FaStar /> <span>Rating &nbsp;</span>{" "}
                <span>{`${rating} / 5`}</span>
              </li>
              <li>
                <FaUserFriends /> <span>Participants &nbsp; </span>{" "}
                <span>{`${maxGroupSize} People`}</span>
              </li>
              <li>
                <FaMap /> <span>Difficulty &nbsp;</span>{" "}
                <span>{difficulty}</span>
              </li>
              <li>
                <FaCalendarAlt /> <span>Next Date &nbsp;</span>{" "}
                <span>
                  {new Date(startDates[0]).toLocaleString("en-us", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="tour-summary">
          <h2>About the {name} tour</h2>
          <p>{desc}</p>
        </div>
      </section>
      <div className="photo-gallery">
        <h2 className="sloping-h2">Photo Gallery</h2>
        <div className="photo-grid">
          {images.map((img) => {
            return <img src={`/img/tours/${img}`} alt="" />;
          })}
        </div>
        {/* <TourMap /> */}
      </div>
      {/* <PhotoGallery/> */}
      <ReviewsSection reviews={reviews} />
    </div>
  );
};

//Not Free OhhhhHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
const TourMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      const map = new window.google.maps.Map(
        document.getElementById("tour-map"),
        {
          center: { lat: 37.7749, lng: -122.4194 },
          zoom: 12,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit.station",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
          ],
        }
      );

      const tourLocations = [
        { lat: 37.7749, lng: -122.4194 },
        { lat: 37.7883, lng: -122.4075 },
        { lat: 37.7749, lng: -122.4313 },
        { lat: 37.7986, lng: -122.4072 },
      ];

      tourLocations.forEach((location) => {
        new window.google.maps.Marker({
          position: location,
          map: map,
          icon: {
            url: "https://maps.google.com/mapfiles/kml/shapes/cycling.png",
            scaledSize: new window.google.maps.Size(40, 40),
          },
        });
      });
    }
  }, [mapLoaded]);

  return (
    <div className="tour-map">
      <h2>Tour Map</h2>
      <div id="tour-map" style={{ height: "500px" }}></div>
    </div>
  );
};
