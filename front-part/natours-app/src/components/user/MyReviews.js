import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Typography,
  Box,
} from '@mui/material';
import { Rating } from '@mui/material';
import ErrorPage from '../error/ErrorPage';
import ReactLoading from 'react-loading';
import { useLocation } from 'react-router-dom';
import { useFetch } from '../utils/useFetch';
import Alert from '../utils/alert';
import { fetchWrapper } from '../utils/fetchWrapper';

function truncate(str, maxLength) {
  if (str.length <= maxLength) {
    return str;
  }
  return str.substr(0, maxLength - 1) + '...';
}

export const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editText, setEditText] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState('');
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [alertInfo, setAlertInfo] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const { state: userId } = useLocation();
  const { status, data, message, loading } = useFetch(
    `http://localhost:1444/api/v1/users/${userId}/reviews`
  );
  useEffect(() => {
    setReviews(data.docs);
  }, [data]);
  // setReviews(data.docs)
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

  if (showAlert) {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      const { message, data, status, loading } = await fetchWrapper(
        `/reviews/${editing}`,
        'PATCH',
        JSON.stringify({
          rating: editRating,
          review: editText,
        }),
        { 'Content-Type': 'application/json' }
      );
      if (status === 'success') {
        setAlertInfo({
          severity: 'success',
          title: 'Message',
          message: 'Review Edited successfully',
        });
        setShowAlert(true);
        const editedReview = {
          ...reviews.find((review) => review._id === editing),
          rating: editRating,
          review: editText,
        };
        setReviews(
          reviews.map((review) => {
            if (review._id === editedReview._id) {
              return editedReview;
            }
            return review;
          })
        );
        setEditing(null);
        setEditRating(0);
        setEditText('');
      } else {
        setAlertInfo({
          severity: 'error',
          title: 'try again',
          message,
        });
        setShowAlert(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  function handleEditCancel() {
    setEditing(null);
    setEditRating(0);
    setEditText('');
  }

  async function handleDelete(reviewId) {
    setDeleteReviewId(reviewId);
    setDeleteDialogOpen(true);
  }

  const handleDeleteConfirm = async () => {
    try {
      const { message, data, status, loading } = await fetchWrapper(
        `/reviews/${deleteReviewId}`,
        'DELETE'
      );
      if (status === 'success') {
        setAlertInfo({
          severity: 'success',
          title: 'Message',
          message: 'Review deleted successfully',
        });
        setShowAlert(true);
        setReviews(reviews.filter((review) => review._id !== deleteReviewId));
      } else {
        setAlertInfo({
          severity: 'error',
          title: 'try again',
          message,
        });
        setShowAlert(true);
      }
      // console.log(data.updatedUser);
      setDeleteDialogOpen(false);
      setDeleteReviewId('');
    } catch (error) {
      console.error(error);
    }
  };

  function handleDeleteCancel() {
    setDeleteDialogOpen(false);
    setDeleteReviewId('');
  }

  function handleExpandReview(reviewId) {
    setExpandedReviewId(reviewId);
  }

  function handleCollapseReview() {
    setExpandedReviewId(null);
  }

  return (
    <Container
      maxWidth="lg"
      style={{ padding: 0, minHeight: '78vh', marginTop: '40px' }}
    >
      {/* <Typography variant="h4" component="h1" className='my-bookings-h1' gutterBottom>
        My Reviews
      </Typography> */}
      {showAlert && (
        <Alert
          severity={alertInfo.severity}
          title={alertInfo.title}
          message={alertInfo.message}
        />
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tour Name</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Review</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviews &&
            reviews.map((review) => (
              <TableRow key={review._id}>
                <TableCell>{review.tour.name}</TableCell>
                <TableCell>
                  <Rating
                    name="read-only"
                    value={review.rating}
                    precision={0.5}
                    readOnly
                  />
                </TableCell>
                <TableCell>
                  {expandedReviewId === review._id ? (
                    <div>
                      {review.review}
                      <Box mt={2} display="inline-block">
                        <Button variant="text" onClick={handleCollapseReview}>
                          Show less
                        </Button>
                      </Box>
                    </div>
                  ) : (
                    <div>
                      {truncate(review.review, 50)}
                      {review.review.length > 50 && (
                        <Box mt={2} display="inline-block" j>
                          <Button
                            variant="text"
                            onClick={() => handleExpandReview(review._id)}
                          >
                            Read more
                          </Button>
                        </Box>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => setEditing(review._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDelete(review._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Dialog open={editing !== null} onClose={handleEditCancel}>
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          <DialogContentText>Please edit your review below.</DialogContentText>
          <Box mb={2}>
            <Rating
              name="edit-rating"
              value={editRating}
              precision={0.5}
              onChange={(event, value) => setEditRating(value)}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Review"
            value={editText}
            onChange={(event) => setEditText(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel}>Cancel</Button>
          <Button color="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this review?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
