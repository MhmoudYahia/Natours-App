import React, { useEffect } from 'react';
import './nav.modul.css';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import IosShareIcon from '@mui/icons-material/IosShare';
import SailingIcon from '@mui/icons-material/Sailing';
import axiosWrapper from '../utils/axiosWrapper';
import Avatar from '@mui/material/Avatar';
import Alert from '../utils/alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useFetch } from '../utils/useFetch';

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertInfo, setAlertInfo] = React.useState({});

  const { loading, status, data, message } = useFetch(
    'http://localhost:1444/api/v1/users/isLoggedIn'
  );
  useEffect(() => {
    if (status === 'success') {
      setUser(data.currentUser);
      setAlertInfo({
        severity: 'success',
        title: 'Logged in successfully',
        message: 'Welcome! You are now logged in',
      });
      setShowAlert(true);
    } else {
      setUser(null);
    }
  }, [status]);

  if (showAlert) {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }

  const handleLogout = async () => {
    try {
      const { status } = await axiosWrapper.get('/users/logout');
      if (status === 'success') {
        setUser(null);
        setAlertInfo({
          severity: 'warning',
          title: 'LOGGING OUT',
          message: 'You are about to Logged Out',
        });
        setShowAlert(true);
        setTimeout(() => {
          navigate('/');
          window.location.reload(true);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav className="navbar">
      <div className="logo">
        <Link className="link" to="/">
          <img src="/img/logo-green-small.png" alt="" />
          <div>ALL TOURS</div>
        </Link>
      </div>
      {showAlert && (
        <Alert
          severity={alertInfo.severity}
          title={alertInfo.title}
          message={alertInfo.message}
        />
      )}
      <div className="navlinks">
        {!user && (
          <Link to="/signin" className="link">
            <Button
              variant="contained"
              className="Button"
              endIcon={<PermIdentityOutlinedIcon />}
            >
              Sign IN
            </Button>
          </Link>
        )}
        {!user && (
          <Link to="/signup" className="link">
            <Button
              variant="contained"
              className="Button"
              endIcon={<IosShareIcon />}
            >
              Sign UP
            </Button>
          </Link>
        )}
        {user && (
          <Button
            onClick={handleLogout}
            variant="contained"
            className="Button"
            endIcon={<LogoutIcon />}
          >
            LOG OUT
          </Button>
        )}
        {user && (
          <Link
            to="/me"
            style={{
              display: 'flex',
              'align-items': 'center',
              gap: ' 10px',
              margin: '0 7px',
              'text-decoration': 'none',
            }}
          >
            <span id="userName">{user.name}</span>
            {
              <div className="guide-profile">
                <img src={`/img/users/${user.photo}`} alt="" />
              </div>
            }{' '}
          </Link>
        )}
      </div>
    </nav>
  );
};
