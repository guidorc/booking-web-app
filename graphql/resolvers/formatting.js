const { dateToString } = require("../../helpers/date");

const Event = require("../../models/event");
const User = require("../../models/user");

const populateUser = async (userId) => {
  try {
    const userData = await User.findById(userId);
    return {
      ...userData._doc,
      createdEvents: populateEvents.bind(this, userData._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

const populateEvents = async (eventIds) => {
  try {
    const eventsData = await Event.find({ _id: { $in: eventIds } });
    return eventsData.map((event) => {
      return formatEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const populateEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return formatEvent(event);
  } catch (err) {
    throw err;
  }
};

const formatEvent = (event) => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    createdBy: populateUser.bind(this, event._doc.createdBy),
  };
};

const formatBooking = (booking) => {
  return {
    ...booking._doc,
    event: populateEvent.bind(this, booking._doc.event),
    user: populateUser.bind(this, booking._doc.user),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

exports.formatEvent = formatEvent;
exports.formatBooking = formatBooking;
