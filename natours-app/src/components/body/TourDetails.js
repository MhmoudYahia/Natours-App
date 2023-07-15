import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useFetch } from '../utils/useFetch';
import { PhotoGallery } from './PhotoGallary';
import { ReviewsSection } from './ReviewsSection';
import { Paypal } from '../utils/Paypal';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Alert from '../utils/alert';
import { ReviewForm } from './AddReview';
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
import ErrorPage from '../error/ErrorPage';

export const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({});
  const [showPaypal, setShowPaypal] = useState(false);
  // const [summary, setSummary] = useState('summary');
  const [selectedDate, setSelectedDate] = useState(null);
  const [disabledPaypal, setDisabledPaypal] = useState(true);

  const {
    status,
    data: tour,
    message,
    loading,
    user,
    booked,
  } = useFetch(`/api/v1/tours/${id}`);

  //check inly after setSelectedDate && git rid of 2 rendering
  useEffect(() => {
    if (selectedDate && selectedDate.soldOut === false) {
      setDisabledPaypal(false);
    } else if (selectedDate && selectedDate.soldOut === true) {
      setAlertInfo({
        severity: 'warning',
        title: 'Sorry',
        message: 'This Date in Fulled! Please select another one',
      });
      setShowAlert(true);
    }
  }, [selectedDate]);

  if (showAlert) {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }
  // if (status !== 'success') {
  //   return <ErrorPage errorMessage={message} />;
  // }
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
    <>
      {tour && tour.doc && (
        <div className="tour-container">
          {showAlert && (
            <Alert
              severity={alertInfo.severity}
              title={alertInfo.title}
              message={alertInfo.message}
            />
          )}
          <section className="tour-image">
            <div className="img-layout"></div>
            <div className="image">
              <img src={`/img/tours/${tour.doc.imageCover}`} alt="" />
            </div>
            <div className="tour-info">
              <h1 className="text-img tour-name">{tour.doc.name}</h1>
              <div className="tour-location-duration">
                <div className="icon-text">
                  {' '}
                  <FaMapMarkerAlt className="icon" />
                  <p
                    className="tour-location"
                    style={{ fontWeight: 700, textTransform: 'uppercase' }}
                  >
                    {tour.doc.startLocation.description}
                  </p>
                </div>
                <div className="icon-text">
                  <FaClock className="icon" />
                  <p
                    className="tour-duration"
                    style={{ fontWeight: 700, textTransform: 'uppercase' }}
                  >
                    {`${tour.doc.duration} Days`}
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
                  {tour.doc.guides &&
                    tour.doc.guides.map((guide) => {
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
                    <span>{`${tour.doc.rating} / 5`}</span>
                  </li>
                  <li>
                    <FaUserFriends /> <span>Total Participants &nbsp; </span>{' '}
                    <span>{`${tour.doc.maxGroupSize} People`}</span>
                  </li>
                  <li>
                    <FaMap /> <span>Difficulty &nbsp;</span>{' '}
                    <span>{tour.doc.difficulty}</span>
                  </li>
                  <li>
                    <FaCalendarAlt /> <span>Next Date &nbsp;</span>{' '}
                    <span>
                      {new Date(tour.doc.startDates[0].date).toLocaleString(
                        'en-us',
                        {
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="tour-summary">
              <h2>About the {tour.doc.name} tour</h2>
              <p>{tour.doc.description}</p>
            </div>
          </section>
          <div className="photo-gallery">
            {/* <h2 className="sloping-h2">Photo Gallery</h2> */}
            <div className="photo-grid">
              {tour.doc.images.map((img) => {
                return <img src={`/img/tours/${img}`} alt="" />;
              })}
            </div>
          </div>
          <div className="tour-map">
            {tour.doc.locations && (
              <Map
                scrollZoom={false}
                mapboxAccessToken="pk.eyJ1IjoibXllaGlhMTYyIiwiYSI6ImNsamxnMDM4bjByYTkzZmxucDRmdzB6bWgifQ.C46RK_qfYHRnmY967KOUOA"
                style={{
                  width: '100%',
                  height: '500px',
                }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
              >
                {tour.doc.locations.map((loc) => {
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
                          <p style={{ flexBasis: '40px' }}>Day {loc.day}:</p>
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
          <ReviewsSection
            reviews={tour.doc.reviews}
            tourId={id}
            user={user}
            booked={booked}
          />
          <div className="book-part">
            <div>
              <img src={`/img/logo-green-round.png`} alt="" />
            </div>
            <div>
              <h2 style={{ textTransform: 'uppercase', color: '#6cdc95' }}>
                what are you waiting for?
              </h2>
              <p
                style={{ color: '#9b9b9b' }}
              >{`${tour.doc.duration} Days. 1 adventure. infinite memories. Make it yours today!`}</p>
            </div>
            <div>
              <button
                className="Button button-book"
                disabled={booked}
                onClick={() => {
                  if (user) setShowPaypal(!showPaypal);
                  else navigate('/signin');
                }}
              >
                {!user
                  ? 'LOGIN AND BOOK NOW!'
                  : booked
                  ? 'You Booked This Tour!'
                  : showPaypal
                  ? 'HIDE PAYPAL'
                  : 'BOOK TOUR NOW'}
              </button>
            </div>
          </div>
          {showPaypal && user && !booked && (
            <div className="payment-process">
              <h2
                style={{
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  fontTeight: 700,
                  color: 'rgb(108, 220, 149)',
                }}
              >
                Payment process
              </h2>
              <FormControl
                sx={{
                  minWidth: 222,
                  width: '486px',
                  margin: '30px auto 20px',
                  position: 'relative',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                <InputLabel
                  id="demo-select-small"
                  style={{ color: 'rgb(108, 220, 149)' }}
                >
                  Select Start Date
                </InputLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                  }}
                  // variant="outlined"
                  fullWidth
                  label="Select Start Date"
                  defaultValue={tour.doc.startDates[0]}
                >
                  <MenuItem value="" disabled>
                    Select a start date
                  </MenuItem>
                  {tour.doc.startDates &&
                    tour.doc.startDates.map((startDate) => (
                      <MenuItem key={startDate._id} value={startDate}>
                        {new Date(startDate.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <hr />
              <div
                className="paypal"
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <Paypal
                  key={user._id}
                  selectedDate={selectedDate}
                  disabled={disabledPaypal}
                  amount={tour.doc.price}
                  name={tour.doc.name}
                  summary={tour.doc.summary}
                  tourId={id}
                  userId={user._id}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
