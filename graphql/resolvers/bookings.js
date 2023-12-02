const { formatEvent, formatBooking } = require("./formatting");

const Booking = require("../../models/booking");

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return formatBooking(booking);
      });
    } catch (err) {
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

      return formatBooking(result);
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args) => {
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
