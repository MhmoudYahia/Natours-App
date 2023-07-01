import React from "react";
import "./sign.css";
import MailIcon from "@mui/icons-material/Mail";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import axiosWrapper from "../utils/axiosWrapper";
import Alert from "../utils/alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export const Signin = () => {
  const his = useNavigate();
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [error, setError] = React.useState(null);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertInfo, setAlertInfo] = React.useState("");
  const [showPass, setShowPass] = React.useState(false);

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleChangeEmail = (event) => {
    if (!isValidEmail(event.target.value)) {
      setError("Email is invalid");
    } else {
      setError(null);
    }

    setEmail(event.target.value);
  };
  const handleChangePass = (e) => {
    setPass(e.target.value);
  };
  const handleToggleShowPass = () => {
    setShowPass(!showPass);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handelSubmitted();
    }
  };

  const handelSubmitted = async (e) => {
    console.log(email, pass);
    try {
      const res = await fetch("http://localhost:1444/api/v1/users/login", {
        method: "POST",
        headers: {
          // Accept: "application/json",
          "Content-Type": "application/json",
        },
        withCredentials: true,
        credentials: "include",
        body: JSON.stringify({
          email,
          password: pass,
        }),
      });
      const { status, message, token } = await res.json();

      if (status !== "success") {
        setAlertInfo({
          severity: "error",
          title: "Error in Logged in ",
          message,
        });
        setShowAlert(true);
      } else {
        setEmail("");
        setPass("");
        his("/");
        window.location.reload();
        console.log(token);
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (showAlert) {
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  }

  return (
    <div className="layout">
      {showAlert && (
        <Alert
          severity={alertInfo.severity}
          title={alertInfo.title}
          message={alertInfo.message}
        />
      )}
      <form className="signin" onSubmit={handelSubmitted}>
        <h2>LOG INTO YOUR ACCOUNT</h2>

        <TextField
          helperText="Please enter your Mail"
          id="demo-helper-text-aligned"
          label="Email"
          value={email}
          onChange={handleChangeEmail}
        />
        <TextField
          helperText="Please enter your Password"
          id="pass"
          label="Password"
          type={showPass ? "text" : "password"}
          value={pass}
          onChange={handleChangePass}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleToggleShowPass}
                  edge="end"
                  style={{ width: "50px" }}
                >
                  {showPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          className="Button"
          variant="outlined"
          onClick={handelSubmitted}
          onKeyDown={handleKeyDown}
        >
          SIGN IN
        </Button>
        <Link to="/signup">
          <p style={{ display: "inline-block" }}>Need Account?</p>
        </Link>
        {/* {error && <h2 style={{ color: "red" }}>{error}</h2>} */}
      </form>
    </div>
  );
};
