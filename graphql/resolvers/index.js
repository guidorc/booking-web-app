const bcrypt = require("bcrypt");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

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
      return {
        ...event._doc,
        createdBy: populateUser.bind(this, event._doc.createdBy),
      };
    });
  } catch (err) {
    throw err;
  }
};

const populateEvent = async (eventId) => {
  try {
    const eventData = await Event.findById(eventId);
    return {
      ...eventData._doc,
      createdBy: populateUser.bind(this, eventData._doc.createdBy),
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          createdBy: populateUser.bind(this, event._doc.createdBy),
        };
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          event: populateEvent.bind(this, booking._doc.event),
          user: populateUser.bind(this, booking._doc.user),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      createdBy: "65673dfacba3cce95275f83b",
    });

    try {
      const result = await event.save();
      const createdEvent = {
        ...result._doc,
        date: new Date(event._doc.date).toISOString(),
        createdBy: populateUser.bind(this, result._doc.createdBy),
      };

      // Store event in user created events list
      const user = await User.findById("65673dfacba3cce95275f83b");
      if (!user) {
        throw new Error("Invalid user.");
      }
      user.createdEvents.push(createdEvent);
      await user.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createUser: async (args) => {
    try {
      // verify user email does not already exist in db
      const conflictingUser = await User.findOne({
        email: args.userInput.email,
      });

      if (conflictingUser) {
        throw new Error("User already exists.");
      }

      // encrypt user password to store in db
      const encryptedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: encryptedPassword,
      });

      const result = await user.save();
      // override password in returned user
      return { ...result._doc, password: null };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  bookEvent: async (args) => {
    try {
      const booking = new Booking({
        event: args.eventId,
        user: "65673dfacba3cce95275f83b",
      });

      const result = await booking.save();

      return {
        ...result._doc,
        event: populateEvent.bind(this, result._doc.event),
        user: populateUser.bind(this, result._doc.user),
        createdAt: new Date(result._doc.createdAt).toISOString(),
        updatedAt: new Date(result._doc.updatedAt).toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = {
        ...booking.event._doc,
        createdBy: populateUser.bind(this, booking.event._doc.createdBy),
      };
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
