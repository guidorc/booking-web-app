import React from "react";

import "./BookingItem.css";

const bookingItem = (props) => {
  return (
    <li key={props.bookingId} className="bookings__list-item">
      <div className="bookings__item-data">
        <h1>{props.title}</h1>
        <h2>{new Date(props.date).toLocaleDateString()}</h2>
      </div>
      <div className="bookings__item-actions">
        <button className="btn" onClick={props.onCancel.bind(this, props.bookingId)}>Cancel</button>
      </div>
    </li>
  );
};

export default bookingItem;
