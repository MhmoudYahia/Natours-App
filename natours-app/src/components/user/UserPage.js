import { useEffect, useState } from 'react';
import './userPage.css';
import SideBar from './SideBar';
import axiosWrapper from '../utils/axiosWrapper';
import ErrorPage from '../error/ErrorPage';
import Alert from '../utils/alert';
import { fetchWrapper } from '../utils/fetchWrapper';

export const UserPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState(null);
  const [userId, setUserId] = useState("")
  const [photoFile, setPhotoFile] = useState(null);
  const [currPassword, setcurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setconfirmNewPassword] = useState('');
  const [role, setRole] = useState('');
  const [alertInfo, setAlertInfo] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertTimeout, setAlertTimeout] = useState(3000);

  const getUserData = async () => {
    const { data, status, message } = await axiosWrapper.get('users/me');
    if (status === 'success') {
      const user = data.doc;
      setName(user.name);
      setPhoto(user.photo);
      setUserId(user._id);
      setEmail(user.email);
      setRole(user.role);
    } else {
      return <ErrorPage errorMessage={message} />;
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setPhotoFile(file);
  };

  const handlecurrPasswordChange = (event) => {
    setcurrPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleconfirmNewPasswordChange = (event) => {
    setconfirmNewPassword(event.target.value);
  };

  if (showAlert) {
    setTimeout(() => {
      setShowAlert(false);
    }, alertTimeout);
  }

  const handleSaveChanges = async () => {
    // create a FormData object to send the data as multipart/form-data
    let formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (photoFile) formData.append('photo', photoFile);
    // In JavaScript, FormData is a built-in object that provides an easy way to construct and send data in multipart/form-data format. This format is commonly used to submit forms that contain files or binary data to a server.
console.log(name, email, photoFile);
    try {
      const { message, data, status, loading } = await fetchWrapper(
        '/users/updateMyData',
        'PATCH',
        formData,
      );
      if (status === 'success') {
        setAlertInfo({
          severity: 'success',
          title: 'Message',
          message: 'Your Data has been Updated successfully',
        });
        setAlertTimeout(3000);
        setShowAlert(true);
        setPhoto(data.updatedUser.photo);
      } else {
        setAlertInfo({
          severity: 'error',
          title: 'try again',
          message,
        });
        setAlertTimeout(10000);
        setShowAlert(true);
      }
      // console.log(data.updatedUser);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePasswordChange = async () => {
    const { message, data, status, loading } = await fetchWrapper(
      '/users/updatePassword',
      'PATCH',
      JSON.stringify({ newPassword, currPassword, confirmNewPassword }),
      { 'Content-Type': 'Application/json' }
    );

    if (status === 'success') {
      setAlertInfo({
        severity: 'success',
        title: 'Message',
        message: 'Your Password has been Updated successfully',
      });
      setAlertTimeout(3000);
      setShowAlert(true);
      setcurrPassword('');
      setNewPassword('');
      setconfirmNewPassword('');
    } else {
      setAlertInfo({
        severity: 'error',
        title: 'try again',
        message,
      });
      setAlertTimeout(10000);
      setShowAlert(true);
    }
  };
  return (
    <div className="account-settings-container">
      <SideBar role={role} userId={userId}/>{' '}
      {showAlert && (
        <Alert
          severity={alertInfo.severity}
          title={alertInfo.title}
          message={alertInfo.message}
        />
      )}
      <div className="account-settings-user-page">
        <h2>Your Account Settings</h2>
        <form className="account-settings-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="form-group">
            {photo && (
              <div
                className="guide-profile"
                style={{ width: '75px', height: '75px' }}
              >
                <img src={`/img/users/${photo}`} alt="" />
              </div>
            )}
            <label class="choose_file">
              Choose New Photo
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                // style={{ display: 'none' }}
              />
            </label>
            <button type="button" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>
          <br />
          <hr />
          <br />
          <div className="form-group">
            <h2>Password Change</h2>
            <div>
              <label htmlFor="current-password">Current Password:</label>
              <input
                type="password"
                id="current-password"
                value={currPassword}
                onChange={handlecurrPasswordChange}
              />
            </div>
            <div>
              <label htmlFor="new-password">New Password:</label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
            </div>
            <div>
              <label htmlFor="confirm-password">Confirm Password:</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmNewPassword}
                onChange={handleconfirmNewPasswordChange}
              />
            </div>
            <button type="button" onClick={handlePasswordChange}>
              Change Password
            </button>
            <br />
            <br />
            <br />
          </div>
        </form>
      </div>
    </div>
  );
};
