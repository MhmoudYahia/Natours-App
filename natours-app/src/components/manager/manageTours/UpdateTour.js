import React, { useState } from 'react';

import {
  TextField,
  Button,
  Grid,
  Autocomplete,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFetch } from '../../utils/useFetch';
import { fetchWrapper } from '../../utils/fetchWrapper';
import Alert from '../../utils/alert';

let tours = [];

export const UpdateTourForm = () => {
  const [alertInfo, setAlertInfo] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertTimeout, setAlertTimeout] = useState(3000);
  const [slectedTour, setSlectedTour] = useState(null);
  const [imageCover, setImageCover] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [showErrro, setShowErrro] = useState(false);
  const [ErrMess, setErrMess] = useState('');
  if (showAlert || showErrro) {
    setTimeout(() => {
      setShowAlert(false);
      setShowErrro(false);
    }, alertTimeout);
  }

  // let guides = [];
  let { status: st1, data: guidesData } = useFetch(
    'http://localhost:1444/api/v1/users?role=guide'
  );

  if (st1 === 'success') guidesData = guidesData.docs;

  const { status: st2, data: guidesData2 } = useFetch(
    'http://localhost:1444/api/v1/users?role=lead-guide'
  );

  if (st1 === 'success') guidesData = guidesData.concat(guidesData2.docs);

  // if (st1 === 'success') {
  //   for (const guide of guidesData) {
  //     if (guide)
  //       guides.push({
  //         label: guide.name,
  //         id: guide._id,
  //         role: guide.role,
  //       });
  //   }
  // }

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

    // dont forget to parse the stringified objects
    let formData = new FormData();
    formData.append('name', slectedTour.name);
    formData.append('price', slectedTour.price);
    formData.append('difficulty', slectedTour.difficulty);
    formData.append('duration', slectedTour.duration);
    formData.append('description', slectedTour.description);
    formData.append('maxGroupSize', slectedTour.maxGroupSize);
    formData.append('guides', JSON.stringify(slectedTour.guides));
    if (imageCover) formData.append('imageCover', imageCover);
    if (image1 || image2 || image3) {
      formData.append('images', image1);
      formData.append('images', image2);
      formData.append('images', image3);
    }
    formData.append('startLocation', JSON.stringify(slectedTour.startLocation));
    formData.append('summary', slectedTour.summary);

    const { message, data, status, loading } = await fetchWrapper(
      `/tours/${slectedTour._id}`,
      'PATCH',
      formData
    );

    if (status === 'success') {
      setAlertInfo({
        severity: 'success',
        title: 'Message',
        message: 'Tour Updated successfully',
      });
      setAlertTimeout(3000);
      setShowAlert(true);
    } else {
      setErrMess(message);
      setAlertInfo({
        severity: 'error',
        title: 'try again',
        message,
      });
      setAlertTimeout(6000);
      setShowAlert(true);
    }
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
          textTransform: 'uppercase',

          textDecoration: 'underline'
        }}
        gutterBottom
      >
        Update Tour
      </Typography>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        value={slectedTour}
        onChange={(e, val) => setSlectedTour(val)}
        options={tours}
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
      {slectedTour && (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Name"
                value={slectedTour.name}
                onChange={(e) =>
                  setSlectedTour((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={slectedTour.difficulty}
                onChange={(e, val) =>
                  setSlectedTour((prev) => ({ ...prev, difficulty: val }))
                }
                options={['easy', 'medium', 'difficult']}
                sx={{}}
                renderInput={(params) => (
                  <TextField {...params} label="Difficulty" />
                )}
                required
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={slectedTour.price}
                onChange={(e) =>
                  setSlectedTour((prev) => ({ ...prev, price: e.target.value }))
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Duration"
                type="number"
                value={slectedTour.duration}
                onChange={(e) =>
                  setSlectedTour((prev) => ({
                    ...prev,
                    duration: e.target.value,
                  }))
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Max Group Size"
                type="number"
                value={slectedTour.maxGroupSize}
                onChange={(e) =>
                  setSlectedTour((prev) => ({
                    ...prev,
                    maxGroupSize: e.target.value,
                  }))
                }
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Summary"
                value={slectedTour.summary}
                onChange={(e) =>
                  setSlectedTour((prev) => ({
                    ...prev,
                    summary: e.target.value,
                  }))
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={slectedTour.description}
                onChange={(e) =>
                  setSlectedTour((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                multiline
                rows={4}
                required
              />
            </Grid>
          </Grid>
          <br />
          <hr />
          <br />

          <Grid
            container
            spacing={3}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
              marginTop: '10px',
            }}
          >
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Start Location Description"
                // name="maxGroupSize"
                value={slectedTour.startLocation.description}
                onChange={(e) =>
                  setSlectedTour((prev) => ({
                    ...prev,
                    startLocation: {
                      description: e.target.value,
                      ...slectedTour.startLocation,
                    },
                  }))
                }
                required
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Start Location Address"
                // type="number"
                value={slectedTour.startLocation.address}
                onChange={(e) =>
                  setSlectedTour((prev) => ({
                    ...prev,
                    startLocation: {
                      address: e.target.value,
                      ...slectedTour.startLocation,
                    },
                  }))
                }
                required
              />
            </Grid>
          </Grid>
          <br />
          <hr />
          <br />
          <Grid container spacing={3}>
            {/* ////////////////////////////// */}
            <Grid
              item
              xs={4}
              style={{
                margin: '20px 0',
              }}
            >
              <Autocomplete
                multiple
                limitTags={3}
                id="tags-standard"
                options={guidesData}
                getOptionLabel={(option) => option.name}
                value={
                  slectedTour.guides &&
                  slectedTour.guides.map((guide) => {
                    guide.label = guide.name;
                    return guide;
                  })
                }
                // defaultValue={[guides[0]]}
                onChange={(e, val) => {
                  console.log(val);
                  setSlectedTour((prev) => ({
                    ...prev,
                    guides: val,
                  }));
                }}
                getOptionSelected={(option, value) =>
                  option.value === value.value
                }
                groupBy={(option) => option.role}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // variant="standard"
                    label="Tour Guides"
                    placeholder="Choose Guide"
                  />
                )}
                required
                // sx={{ width: '250px' }}
              />
            </Grid>
          </Grid>
          <br />
          <hr />
          <br />
          <Grid container sx={12} gap={5} style={{ marginBottom: 10 }}>
            <Button variant="contained" component="label">
              Upload Image Cover
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImageCover(file);
                }}
              />
            </Button>
            <Button variant="contained" component="label">
              Upload Image 1
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files.length > 0);

                  const file = e.target.files[0];
                  setImage1(file);
                }}
              />
            </Button>
            <Button variant="contained" component="label">
              Upload Image 2
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files.length > 0);
                  const file = e.target.files[0];
                  setImage2(file);
                }}
              />
            </Button>
            <Button variant="contained" component="label">
              Upload Image 3
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files.length > 0);

                  const file = e.target.files[0];
                  setImage3(file);
                }}
              />
            </Button>
          </Grid>

          <Grid
            item
            xs={12}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{
                backgroundImage:
                  'linear-gradient(to right bottom, #7dd56f, #28b487)',
                marginTop: 30,
                marginBottom: 30,
              }}
            >
              Update
            </Button>
          </Grid>
        </form>
      )}
      {showAlert && (
        <Typography
          component="h6"
          style={{
            textAlign: 'center',
            marginBottom: 60,
          }}
          gutterBottom
          color="success"
        >
          Tour Updated successfully
        </Typography>
      )}
      {showErrro && (
        <Typography
          color="error"
          component="h6"
          style={{
            textAlign: 'center',
            marginBottom: 60,
          }}
          gutterBottom
        >
          {ErrMess}
        </Typography>
      )}
    </div>
  );
};
