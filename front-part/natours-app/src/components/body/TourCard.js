import React from "react";
import "./card.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TourIcon from "@mui/icons-material/Tour";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

export const TourCard = () => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="img-layout"></div>
        <div className="image">
          <img
            src="https://www.natours.dev/img/tours/tour-5-cover.jpg"
            alt=""
          />
        </div>
        <div className="text-img tour-name">Forest gggggg</div>
      </div>
      <div className="card-data">
        <p style={{ fontWeight: 700 }}>EASY 5-DAY TOUR</p>
        <p>Breathtaking hike through the Canadian Banff National Park</p>
        <div className="card-details">
          <div>
            <LocationOnIcon style={{ color: "rgba(40, 180, 135, 0.85)" }} />

            <span>Misr</span>
          </div>
          <div>
            <PeopleIcon style={{ color: "rgba(40, 180, 135, 0.85)" }} />
            <span>15</span>
            <span> People</span>
          </div>
          <div>
            <TourIcon style={{ color: "rgba(40, 180, 135, 0.85)" }} />
            <span>5</span>
            <span> stops</span>
          </div>
          <div>
            <WorkIcon style={{ color: "rgba(40, 180, 135, 0.85)" }} />
            <span>April 2021</span>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <div className="footer-data">
          <p>
            <span>$522 </span>Per Person
          </p>
          <p>
            <span>4.8</span> rating<span>(11)</span>
          </p>
        </div>
        <div>
          <Link to="/tour" className="link">
            {" "}
            <Button className="Button" variant="outlined">
              Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
