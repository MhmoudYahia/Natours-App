import React from 'react';
import { Box, Rating, TextareaAutosize, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import Alert from '../utils/alert';
import { fetchWrapper } from '../utils/fetchWrapper';

export const ReviewForm = ({ tour, user }) => {
  const [value, setValue] = React.useState(3);
  const [hover, setHover] = React.useState(-1);
  const [text, setText] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertInfo, setAlertInfo] = React.useState('');
  if (showAlert) {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }
  const labels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
  };

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { message, data, status, loading } = await fetchWrapper(
        '/reviews/addreview',
        'POST',
        JSON.stringify({
          review: text,
          rating: value,
          tour,
          user,
        }),
        { 'Content-Type': 'application/json' }
      );
      if (status === 'success') {
        setAlertInfo({
          severity: 'success',
          title: 'Thank You',
          message: 'Review Added successfully',
        });
        setShowAlert(true);
        setText('');
        // his('/my-reviews');
      } else {
        setAlertInfo({
          severity: 'error',
          title: 'try again',
          message,
        });
        setShowAlert(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="reviewForm">
        {showAlert && (
          <Alert
            severity={alertInfo.severity}
            title={alertInfo.title}
            message={alertInfo.message}
          />
        )}
        <form onSubmit={handleSubmit}>
          <h3
            style={{
              textTransform: 'uppercase',
              color: '#6cdc95',
              textAlign: 'center',
            }}
          >
            Add Review
          </h3>
          <Box
            sx={{
              width: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '8px',
              margin: '30px',
            }}
          >
            <Rating
              name="hover-feedback"
              value={value}
              precision={0.5}
              getLabelText={getLabelText}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              emptyIcon={
                <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
              }
            />
            {value !== null && (
              <Box sx={{ ml: 2, color: '#6cdc95' }}>
                {labels[hover !== -1 ? hover : value]}
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              marginTop: '1rem',
            }}
          >
            <label
              htmlFor="review-body"
              style={{
                fontWeight: 600,
                padding: '3px 0px',
                color: 'rgb(108, 220, 149)',
              }}
            >
              Review:
            </label>
            <TextareaAutosize
              id="review-body"
              aria-label="Review"
              placeholder="Write your review here..."
              minRows={5}
              value={text}
              onChange={(event) => setText(event.target.value)}
              style={{
                outline: 'none',
                border: '1px solid rgb(108, 220, 149)',
                padding: '6px',
              }}
              // minLength={10}
            />
          </Box>
          <Box sx={{ marginTop: '1rem' }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, 'background-color': ' #6cdc95' }}
            >
              Submit review
            </Button>
          </Box>
        </form>
      </div>
    </>
  );
};
