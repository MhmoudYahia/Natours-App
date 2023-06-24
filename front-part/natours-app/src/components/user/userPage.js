import { useState } from "react";
import "./userPage.css";
import SideBar from "./SideBar";

export const UserPage = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [photo, setPhoto] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const handleSaveChanges = () => {
    // TODO: Implement save changes functionality
  };

  const handlePasswordChange = () => {
    // TODO: Implement password change functionality
  };

  return (
    <div className="account-settings-container">
      <SideBar />
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
            {photo && (
              <img
                src={URL.createObjectURL(photo)}
                alt="Profile"
                className="profile-photo"
              />
            )}
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
