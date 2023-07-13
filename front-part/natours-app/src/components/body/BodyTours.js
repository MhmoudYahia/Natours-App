import React, { useState } from 'react';
import { TourCard } from './TourCard';
import './Card.css';
import ErrorPage from '../error/ErrorPage';
import ReactLoading from 'react-loading';
import Fab from '@mui/material/Fab';
import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useFetch } from '../utils/useFetch';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';

export const BodyTours = () => {
  const [filterBody, setFilterBody] = useState('');
  const [showButton, setShowButton] = React.useState(false);
  const handleScroll = () => {
    if (window.scrollY > 100) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { status, data, message, loading } = useFetch(
    `http://localhost:1444/api/v1/tours/${filterBody}`
  );
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
    <div className="Body-cards">
      {data &&
        data.docs &&
        data.docs.map((tour) => {
          return <TourCard tour={tour} />;
        })}
      {showButton && (
        <Fab
          color="secondary"
          onClick={() => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth',
            });
          }}
          aria-label="add"
          style={{
            backgroundImage:
              'linear-gradient(to right bottom, #7dd56f, #28b487)',
            position: 'fixed',
            bottom: '50px',
            right: '20px',
          }}
        >
          <UpIcon />
        </Fab>
      )}

      <Fab
        variant="extended"
        color="secondary"
        aria-label="add"
        onClick={() => {
          setFilterBody(filterBody ? '' : 'top-5-cheap');
        }}
        style={{
          backgroundImage: 'linear-gradient(to right bottom, #7dd56f, #28b487)',
          position: 'absolute',
          top: '100px',
          left: '-45px',
        }}
      >
        <MonetizationOnIcon sx={{ mr: 1 }} />
        {filterBody ? 'All Tours' : 'Top 5 Cheapest'}
      </Fab>
      <Fab
        variant="extended"
        color="secondary"
        aria-label="add"
        onClick={() => {
          window.scrollTo({
            top: document.body.scrollHeight,

            left: 0,
            behavior: 'smooth',
          });
        }}
        style={{
          backgroundImage: 'linear-gradient(to right bottom, #7dd56f, #28b487)',
          position: 'absolute',
          top: '173px',
          left: '-45px',
        }}
      >
        <MonetizationOnIcon sx={{ mr: 1 }} />
        Tour Stats
      </Fab>
      <StatsTable />
    </div>
  );
};

const StatsTable = () => {
  const {
    status,
    data: stats,
    message,
    loading,
  } = useFetch(`http://localhost:1444/api/v1/tours/tour-stats`);

  return (
    <Box>
      <Typography
        variant="h6"
        style={{
          textAlign: 'center',
          margin: '15px',
          textTransform: 'uppercase',
          textDecoration: 'underline',
          fontWeight: 600,
        }}
      >
        Tour Stats
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Difficulty</TableCell>
            <TableCell>Number of Tours</TableCell>
            <TableCell>Number of Ratings</TableCell>
            <TableCell>Average Rating</TableCell>
            <TableCell>Minimum Price</TableCell>
            <TableCell>Maximum Price</TableCell>
            <TableCell>Average Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stats &&
            stats.stats &&
            stats.stats.map((stat) => (
              <TableRow key={stat._id}>
                <TableCell>{stat._id}</TableCell>
                <TableCell>{stat.numTours}</TableCell>
                <TableCell>{stat.numRatings}</TableCell>
                <TableCell>{stat.avgRating.toFixed(2)}</TableCell>
                <TableCell>{stat.minPrice}</TableCell>
                <TableCell>{stat.maxPrice}</TableCell>
                <TableCell>{stat.avgPrice.toFixed(2)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Box>
  );
};
