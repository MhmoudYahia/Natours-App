import { useEffect, useState } from "react";
import "./userPage.css";
import SideBar from "./SideBar";
import axiosWrapper from "../utils/axiosWrapper";
import ErrorPage from "../error/ErrorPage";
import Alert from "../utils/alert";
import { fetchWrapper } from "../utils/fetchWrapper";

export const UserPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [alertInfo, setAlertInfo] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const getUserData = async () => {
    const { data, status, message } = await axiosWrapper.get("users/me");
    if (status === "success") {
      const user = data.doc;
      setName(user.name);
      setPhoto(user.photo);
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
    setPhoto(file);
  };

  const handleCurrentPasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  if (showAlert) {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }

  const handleSaveChanges = async () => {
    try {
      const res1 = await fetch(
        "http://localhost:1444/api/v1/users/updateMyData",
        { credentials: "include", withCredentials: true }
      );
      const { message, status, data } = await res1.json();

      if (status === "success") {
        setAlertInfo({
          severity: "success",
          title: "Message",
          message: "Your Data has been Updated successfully",
        });
        setShowAlert(true);
      } else {
        setAlertInfo({
          severity: "error",
          title: "try again",
          message,
        });
        setShowAlert(true);
      }
      // console.log(data.updatedUser);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePasswordChange = () => {
    const { message, data, status, loading } = fetchWrapper(
      "/users/updatePassword",
      "PATCH",
      { newPassword, currentPassword, confirmPassword }
    );
    console.log(message, data, status, loading);
  };

  return (
    <div className="account-settings-container">
      <SideBar role={role} />{" "}
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
              <div className="guide-profile">
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
                onchange={handlePhotoChange}
                style={{ display: "none" }}
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
                value={currentPassword}
                onChange={handleCurrentPasswordChange}
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
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
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