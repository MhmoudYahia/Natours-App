import React from 'react';
import { TourCard } from '../body/TourCard';
import { useLocation } from 'react-router-dom';
import { useFetch } from '../utils/useFetch';
import ErrorPage from '../error/ErrorPage';
import ReactLoading from 'react-loading';

export const MyBookings = () => {
  const { state: userId } = useLocation();
  const { status, data, message, loading } = useFetch(
    `http://localhost:1444/api/v1/bookings/${userId}`
  );
  console.log(data);
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

  if (status !== 'success') {
    return <ErrorPage errorMessage={message} />;
  }

  return (
    <>
    <h1 className='my-bookings-h1'>My Bookings</h1>
      <div className="Body-cards">
        
        {data && data.docs.map((booking) => <TourCard tour={booking.tour} />)}
      </div>
    </>
  );
};
