import React from "react";
import "./nav.modul.css";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import IosShareIcon from "@mui/icons-material/IosShare";
import SailingIcon from "@mui/icons-material/Sailing";
import axiosWrapper from "../utils/axiosWrapper";
import Avatar from "@mui/material/Avatar";

export const Navbar = () => {
  const [user, setUser] = React.useState({});

  const fetchData = async () => {
    try {
      const { status, user } = await axiosWrapper.get("/users/isLoggedIn");
      if (status === "success") {
        setUser(user.currentUser);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link className="link" to="/">
          <img src="/img/logo-green-small.png" alt="" />
          <div>All Tours</div>
        </Link>
      </div>
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
          <Link
            to="/userpage"
            style={{
              display: "flex",
              "align-items": "center",
              gap: " 10px",
              margin: "0 7px",
              "text-decoration": "none",
            }}
          >
            <span id="userName">{user.name}</span>
            {
              <Avatar
                alt={user.name}
                src={`/img/users/${user.photo}`}
                style={
                  {
                    // padding: "5px",
                  }
                }
              >
                {user.name}
              </Avatar>
            }{" "}
          </Link>
        )}
        {user && (
          <Link to="/logout" className="link">
            <Button
              variant="contained"
              className="Button"
              endIcon={<LogoutIcon />}
            >
              LOG OUT
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};
