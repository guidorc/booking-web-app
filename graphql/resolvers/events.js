const { dateToString } = require("../../helpers/date");
const { formatEvent } = require("./formatting");

const Event = require("../../models/event");

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
  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      createdBy: "65673dfacba3cce95275f83b",
    });

    try {
      const result = await event.save();
      const createdEvent = formatEvent(result);

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
};
