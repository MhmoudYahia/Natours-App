import React from "react";
import { TourCard } from "./TourCard";
import "./Card.css";
import ErrorPage from "../error/ErrorPage";
import ReactLoading from "react-loading";

import { useFetch } from "../utils/useFetch";

export const BodyTours = () => {

  const { status, data, message ,loading} = useFetch(
    "http://localhost:1444/api/v1/tours"
  );
  if (loading) {
    return (
      <ReactLoading
        type="spinningBubbles"
        color="#0000FF"
        height={100}
        width={50}
        style={{
          height: "50vh",
          width: "100px",
          margin: "auto",
          /* margin-top: 69px; */
          display: "flex",
        }}
      />
    );
  }

  if (status !== "success") {
    return <ErrorPage errorMessage={message} />;
  }

  return (
    <div className="Body-cards">
      {data &&
        data.docs &&
        data.docs.map((tour) => {
          return <TourCard tour={tour} />;
        })}
    </div>
  );
};
