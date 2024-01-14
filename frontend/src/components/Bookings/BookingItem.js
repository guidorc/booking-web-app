import React from "react";

import "./BookingItem.css";

const bookingItem = (props) => {
  return (
    <li key={props.bookingId} className="bookings__list-item">
      <div>
        <h1>{props.title}</h1>
        <h1>{props.date}</h1>
      </div>
    </li>
  );
};

export default bookingItem;
