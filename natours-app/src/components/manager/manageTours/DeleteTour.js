import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  TextField,
  Button,
  Grid,
  Autocomplete,
  Typography,
} from '@mui/material';
import { useFetch } from '../../utils/useFetch';
import { fetchWrapper } from '../../utils/fetchWrapper';
import Alert from '../../utils/alert';

let tours = [];

export const DeleteTourForm = () => {
  const [alertInfo, setAlertInfo] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertTimeout, setAlertTimeout] = useState(3000);
  const [slectedTour, setSlectedTour] = useState(null);
  const [imageCover, setImageCover] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  if (showAlert) {
    setTimeout(() => {
      setShowAlert(false);
    }, alertTimeout);
  }

  const { data: mytours, status: st3 } = useFetch(
    'http://localhost:1444/api/v1/tours'
  );

  if (st3 === 'success' && mytours) {
    tours = mytours.docs.map((tour) => {
      tour.label = tour.name;
      return tour;
    });
  }
  const handleSubmit = async (event) => {
    event.preventDefault();

    const { message, data, status, loading } = await fetchWrapper(
      `/tours/${slectedTour._id}`,
      'DELETE'
    );

    if (status === 'success') {
      setAlertInfo({
        severity: 'success',
        title: 'Message',
        message:
          'Tour Deleted successfully, go to update tour to update photos',
      });
      setAlertTimeout(3000);
      setShowAlert(true);
      mytours.docs = mytours.docs.filter(
        (tour) => tour._id !== slectedTour._id
      );
    } else {
      setAlertInfo({
        severity: 'error',
        title: 'try again',
        message,
      });
      setAlertTimeout(6000);
      setShowAlert(true);
    }
    setSlectedTour(null);
    return false; // prevent page from reloading
  };

  return (
    <div style={{ minHeight: '500px' }}>
      {showAlert && (
        <Alert
          severity={alertInfo.severity}
          title={alertInfo.title}
          message={alertInfo.message}
        />
      )}
      <Typography
        variant="h4"
        component="h1"
        // className="my-bookings-h1"
        style={{
          textAlign: 'center',
          margin: '10px 25px 50px',
          textDecoration: 'underline',
          textTransform: 'uppercase',
        }}
        gutterBottom
      >
        Delete Tour
      </Typography>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        value={slectedTour}
        getOptionLabel={(option) => option.name}
        onChange={(e, val) => setSlectedTour(val)}
        options={mytours.docs}
        sx={{
          width: 300,
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '30px',
        }}
        renderInput={(params) => <TextField {...params} label="Tour" />}
        getOptionSelected={(option, value) => option.value === value.value}
      />
      <Dialog open={slectedTour} onClose={(e) => setSlectedTour(null)}>
        <DialogTitle>Delete Tour</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this tour?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => setSlectedTour(null)}>Cancel</Button>
          <Button color="error" onClick={handleSubmit}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
