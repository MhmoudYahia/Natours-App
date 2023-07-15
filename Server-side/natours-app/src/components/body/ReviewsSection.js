import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Typography, Box, Rating, Grid } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ReviewForm } from './AddReview';
import { Button } from '@mui/material';

const ReviewCard = ({ review }) => {
  const [hover, setHover] = useState(-1);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: 300,
        Height: 400,
        marginBottom: 4,
        p: 4,
        borderRadius: 4,
        bgcolor: 'background.paper',
        boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.2)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          marginBottom: '50px',
        }}
      >
        {review.user && (
          <Avatar
            alt={review.user.name}
            src={`/img/users/${review.user.photo}`}
          />
        )}
        <Typography variant="h6" style={{ margin: '7px' }}>
          {review.user && review.user.name}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ mb: 2, height: 100, color: '#a1a1a1' }}>
        {review.review}
      </Typography>
      <Rating
        value={review.rating}
        readOnly
        precision={0.5}
        step={0.5}
        size="large"
        sx={{
          mb: 2,
          '& .MuiRating-iconEmpty': {
            color: hover !== -1 ? '#f7d2c4' : '#e8e8e8',
          },
          '& .MuiRating-iconFilled': {
            color: '#7dd56f',
          },
        }}
        onMouseEnter={(e) =>
          setHover(parseInt(e.currentTarget.getAttribute('aria-valuenow')))
        }
        onMouseLeave={() => setHover(-1)}
      />
    </Box>
  );
};

export const ReviewsSection = ({ reviews, tourId, user, booked }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  return (
    <div
      className="reviews-section-tour"
      style={{ backgroundImage: 'linear-gradient(to right, #7dd56f, #28b487)' }}
    >
      {/* <h2
        style={{
          transform: "skewY(3deg)",
          textAlign: "center",
          color: "white",
          fontSize: "40px",
        }}
      >
        Reviews
      </h2> */}
      <Slider {...settings}>
        {reviews &&
          reviews.map((review) => (
            <div key={review.id}>
              <ReviewCard review={review} />
            </div>
          ))}
      </Slider>
      {user && booked && (
        <Box
          sx={{
            marginTop: '1rem',
            width: 'fit-content',
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%) skewY(3deg)',
            marginBottom: '51px',
          }}
        >
          <Button
            onClick={() => setShowAddReviewForm(!showAddReviewForm)}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, 'background-color': ' #6cdc95' }}
          >
            {showAddReviewForm ? 'Hide the form' : 'Add Review on this tour'}
          </Button>
        </Box>
      )}
      {showAddReviewForm && user && (
        <ReviewForm tour={tourId} user={user._id} />
      )}
    </div>
  );
};
