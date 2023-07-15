import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AddTourForm } from './CreateToure';
import { UpdateTourForm } from './UpdateTour';
import { DeleteTourForm } from './DeleteTour';
import { MonthlyPlanTable } from './MonthlyPlan';
import ErrorPage from '../../error/ErrorPage';
import { useLocation } from 'react-router-dom';
import { useFetch } from '../../utils/useFetch';
import ReactLoading from 'react-loading';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export const ManageTourPanel = (props) => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const { loading, status, data, message } = useFetch(
    '/api/v1/users/isLoggedIn'
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

  const { role, _id: userId } = data.currentUser;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div>
      <AppBar
        sx={{
          backgroundImage: 'linear-gradient(to right bottom, #7dd56f, #28b487)',
        }}
        position="static"
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="warning"
          textColor="inherit"
          scrollButtons={true}
          variant="scrollable"
          // scrollButtons="auto"
          centered
          aria-label="full width tabs example"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Tab
            disabled={role !== 'admin' && role !== 'lead-guide'}
            label="Create Tour"
            {...a11yProps(0)}
          />
          <Tab
            disabled={role !== 'admin' && role !== 'lead-guide'}
            label="Update Tour"
            {...a11yProps(1)}
          />
          <Tab
            disabled={role !== 'admin' && role !== 'lead-guide'}
            label="Delete Tour"
            {...a11yProps(2)}
          />
           <Tab
            disabled={role !== 'admin' && role !== 'lead-guide' && role !== 'guide'}
            label="Monthly Plan"
            {...a11yProps(3)}
          />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <AddTourForm />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <UpdateTourForm />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <DeleteTourForm />
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <MonthlyPlanTable />
        </TabPanel>
      </SwipeableViews>
    </div>
  );
};
