import React from "react";

import BookingItem from "./BookingItem";

import "./BookingsList.css";

const bookingsList = (props) => {
	const bookings = props.bookings.map((booking) => {
		return (
		  <BookingItem
			key={booking._id}
			bookingId={booking._id}
			eventId={booking.event._id}
			title={booking.event.title}
			date={booking.event.date}
		  />
		);
	  });
	  return <ul className="bookings__list">{bookings}</ul>;
};

export default bookingsList;
