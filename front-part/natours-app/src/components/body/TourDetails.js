import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../utils/useFetch';
import { PhotoGallery } from './PhotoGallary';
import { ReviewsSection } from './ReviewsSection';

import Map, {
  Marker,
  NavigationControl,
  GeolocateControl,
  FullscreenControl,
  Popup,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactLoading from 'react-loading';
import './Tour.css';
import {
  FaStar,
  FaUserFriends,
  FaMap,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
} from 'react-icons/fa';
import axiosWrapper from '../utils/axiosWrapper';

export const TourDetails = () => {
  const { id } = useParams();

  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });
  const [name, setName] = useState('Tour-name');
  const [rating, setRating] = useState(4.5);
  const [difficulty, setDifficulty] = useState('medium');
  const [images, setImages] = useState([]);
  const [coverImg, setCoverImg] = useState('');
  const [startLocation, setStartLocation] = useState('startLocation');
  const [duration, setDuration] = useState('duration');
  const [desc, setDesc] = useState('desc');
  const [maxGroupSize, setMaxGroupSize] = useState('maxGroupSize');
  const [startDates, setStartDates] = useState('startDates');
  const [reviews, setReviews] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const handleClosePopup = () => {
    setSelectedLocation(null);
  };
  const fetchData = async () => {
    try {
      const { data } = await axiosWrapper.get(`/tours/${id}`);
      let tour = data.doc;
      setLoading(false);
      setName(tour.name);
      setLocations(tour.locations);
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
        style={{
          height: '50vh',
          width: '100px',
          margin: 'auto',
          /* margin-top: 69px; */
          display: 'flex',
        }}
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
              {' '}
              <FaMapMarkerAlt className="icon" />
              <p
                className="tour-location"
                style={{ fontWeight: 700, textTransform: 'uppercase' }}
              >
                {startLocation.description}
              </p>
            </div>
            <div className="icon-text">
              <FaClock className="icon" />
              <p
                className="tour-duration"
                style={{ fontWeight: 700, textTransform: 'uppercase' }}
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
                <FaStar /> <span>Rating &nbsp;</span>{' '}
                <span>{`${rating} / 5`}</span>
              </li>
              <li>
                <FaUserFriends /> <span>Participants &nbsp; </span>{' '}
                <span>{`${maxGroupSize} People`}</span>
              </li>
              <li>
                <FaMap /> <span>Difficulty &nbsp;</span>{' '}
                <span>{difficulty}</span>
              </li>
              <li>
                <FaCalendarAlt /> <span>Next Date &nbsp;</span>{' '}
                <span>
                  {new Date(startDates[0]).toLocaleString('en-us', {
                    month: 'long',
                    year: 'numeric',
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
        {/* <h2 className="sloping-h2">Photo Gallery</h2> */}
        <div className="photo-grid">
          {images.map((img) => {
            return <img src={`/img/tours/${img}`} alt="" />;
          })}
        </div>
      </div>
      <div className="tour-map">
        {locations && (
          <Map
            scrollZoom={false}
            mapboxAccessToken="pk.eyJ1IjoibXllaGlhMTYyIiwiYSI6ImNsamxnMDM4bjByYTkzZmxucDRmdzB6bWgifQ.C46RK_qfYHRnmY967KOUOA"
            style={{
              width: '100%',
              height: '500px',
            }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
          >
            {locations.map((loc) => {
              return (
                <Marker
                  longitude={loc.coordinates[0]}
                  latitude={loc.coordinates[1]}
                  // icon={<FaMapMarkerAlt />}
                  key={loc._id}
                
                >
                  <Popup
                    longitude={loc.coordinates[0]}
                    latitude={loc.coordinates[1]}
                    closeButton={false}
                    closeOnClick={false}
                  >
                    <div className="location-info">
                      <p>Day {loc.day}:</p>
                      <h3>{loc.description}</h3>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
            <NavigationControl position="bottom-right" />
            <FullscreenControl />
            <GeolocateControl />
          </Map>
        )}
      </div>
      {/* <PhotoGallery/> */}
      <ReviewsSection reviews={reviews} />
    </div>
  );
};
