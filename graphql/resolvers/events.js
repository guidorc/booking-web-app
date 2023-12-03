const { dateToString } = require("../../helpers/date");
const { formatEvent } = require("./formatting");

const Event = require("../../models/event");
const User = require("../../models/user");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return formatEvent(event);
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createEvent: async (args, req) => {
    // check authentication
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }

    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      createdBy: req.userId,
    });

    try {
      const result = await event.save();
      const createdEvent = formatEvent(result);

      // Store event in user created events list
      const user = await User.findById(req.userId);
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
};
