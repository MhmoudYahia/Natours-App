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

export const AddTourForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(null);
  const [difficulty, setDifficulty] = useState('');
  const [duration, setDuration] = useState(null);
  const [desc, setDesc] = useState('');
  const [maxGroupSize, setMaxGroupSize] = useState(null);
  const [startDateSelected, setStartDateSelected] = useState('');
  const [startDates, setStartDates] = useState([]);
  const [guidesSelected, setGuidesSelected] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locationDescription, setLocationDescription] = useState('');
  const [locationDescription2, setLocationDescription2] = useState('');
  const [locationDay, setLocationDay] = useState('');
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [lat2, setLat2] = useState(0);
  const [lng2, setLng2] = useState(0);
  const [locationAddress, setLocationAddress] = useState('');
  const [summary, setSummary] = useState('summary');
  const [imageCover, setImageCover] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [alertInfo, setAlertInfo] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertTimeout, setAlertTimeout] = useState(3000);
  if (showAlert) {
    setTimeout(() => {
      setShowAlert(false);
    }, alertTimeout);
  }

  // !!!!!!!!!!!!!!
  //TODO: why refresh when submit a file
  const handleSubmit = async (event) => {
    event.preventDefault();
    const guides = [];
    guidesSelected.forEach((guid, index) => {
      guides.push(guid.id);
    });

    // dont forget to parse the stringified objects
    let formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('difficulty', difficulty);
    formData.append('duration', duration);
    formData.append('description', desc);
    formData.append('maxGroupSize', maxGroupSize);
    formData.append('startDates', JSON.stringify(startDates));
    formData.append('guides', JSON.stringify(guides));
    formData.append('imageCover', imageCover);
    formData.append('images', image1);
    formData.append('images', image2);
    formData.append('images', image3);
    formData.append(
      'startLocation',
      JSON.stringify({
        address: locationAddress,
        description: locationDescription2,
        coordinates: [Number(lng2), Number(lat2)],
      })
    );
    formData.append('summary', summary);
    formData.append('locations', JSON.stringify(locations));

    const { message, data, status, loading } = await fetchWrapper(
      '/tours',
      'POST',
      formData
    );
    event.preventDefault();
    if (status === 'success') {
      setAlertInfo({
        severity: 'success',
        title: 'Message',
        message: 'Tour Added successfully, go to update tour to update photos',
      });
      setAlertTimeout(3000);
      setShowAlert(true);
    } else {
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

  let guides = [];
  let { status: st1, data: guidesData } = useFetch(
    'http://localhost:1444/api/v1/users?role=guide'
  );

  if (st1 === 'success') guidesData = guidesData.docs;

  const { status: st2, data: guidesData2 } = useFetch(
    'http://localhost:1444/api/v1/users?role=lead-guide'
  );

  if (st1 === 'success') guidesData = guidesData.concat(guidesData2.docs);

  if (st1 === 'success') {
    for (const guide of guidesData) {
      if (guide)
        guides.push({
          label: guide.name,
          id: guide._id,
          role: guide.role,
        });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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
        Create Tour
      </Typography>
      {showAlert && (
        <Alert
          severity={alertInfo.severity}
          title={alertInfo.title}
          message={alertInfo.message}
        />
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            value={difficulty}
            onChange={(e, val) => setDifficulty(val)}
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
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="Duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="Max Group Size"
            type="number"
            value={maxGroupSize}
            onChange={(e) => setMaxGroupSize(Number(e.target.value))}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
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
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Location Description"
            // name="maxGroupSize"
            value={locationDescription}
            onChange={(e) => setLocationDescription(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="Day"
            type="number"
            value={locationDay}
            onChange={(e) => setLocationDay(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="latitude"
            type="number"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="longitude"
            type="number"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              setLocations([
                ...locations,
                {
                  day: Number(locationDay),
                  description: locationDescription,
                  coordinates: [Number(lng), Number(lat)],
                },
              ]);
              setLocationDay('');
              setLocationDescription('');
              setLat('');
              setLng('');
            }}
          >
            Add Location
          </Button>
        </Grid>
      </Grid>

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
            value={locationDescription2}
            onChange={(e) => setLocationDescription2(e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Start Location Address"
            // type="number"
            value={locationAddress}
            onChange={(e) => setLocationAddress(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="Latitude Start Location"
            type="number"
            value={lat2}
            onChange={(e) => setLat2(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="Longitude Start Location"
            type="number"
            value={lng2}
            onChange={(e) => setLng2(e.target.value)}
            required
          />
        </Grid>
      </Grid>
      <br />
      <hr />
      <br />
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          sm={4}
          style={{
            // margin: '20px 0',
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '20px',
            alignItems: 'center',
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date 1"
              value={startDateSelected}
              onChange={(date) => setStartDateSelected(new Date(date))}
              renderInput={(params) => <TextField {...params} />}
              required
            />
          </LocalizationProvider>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (startDateSelected) {
                  setStartDates([...startDates, { date: startDateSelected }]);
                  setStartDateSelected('');
                }
              }}
            >
              Add Date
            </Button>
          </Grid>
        </Grid>
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
            options={guides}
            getOptionLabel={(option) => {
              if (option) return option.label;
            }}
            // defaultValue={[guides[0]]}
            onChange={(e, val) => setGuidesSelected(val)}
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
            required
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

      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
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
          Add Tour
        </Button>
      </Grid>
    </form>
  );
};
