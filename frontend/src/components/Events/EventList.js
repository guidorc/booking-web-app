import React from "react";

import EventItem from "./EventItem";

import "./EventList.css";

const eventList = (props) => {
  const events = props.events.map((event) => {
    return (
      <EventItem
        key={event._id}
        eventId={event._id}
        title={event.title}
        price={event.price}
        date={event.date}
        userId={props.authUserId}
        creatorId={event.createdBy._id}
        onDetails={props.onViewDetails}
      />
    );
  });
  return <ul className="event__list">{events}</ul>;
};

export default eventList;
