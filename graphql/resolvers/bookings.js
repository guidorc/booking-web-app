const { formatEvent, formatBooking } = require("./formatting");

const Booking = require("../../models/booking");

module.exports = {
  bookings: async (args, req) => {
    // check authentication
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }

    try {
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map((booking) => {
        return formatBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    // check authentication
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }

    try {
      const booking = new Booking({
        event: args.eventId,
        user: req.userId,
      });

      const result = await booking.save();

      return formatBooking(result);
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args, req) => {
    // check authentication
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }

    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = formatEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
