const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Event = require("./models/event");
const User = require("./models/user");

const app = express();

app.use(bodyParser.json());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type User {
        _id: ID!
        email: String!
        password: String
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input UserInput {
        email: String!
        password: String!
      }
      
      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput!): Event
        createUser(userInput: UserInput!): User
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
  `),
    rootValue: {
      events: async () => {
        try {
          const events = await Event.find();
          return events.map((event) => {
            return { ...event._doc };
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
          date: new Date(args.eventInput.date),
          createdBy: "65673dfacba3cce95275f83b",
        });

        try {
          const result = await event.save();

          // Store event in user created events list
          const user = await User.findById("65673dfacba3cce95275f83b");
          if (!user) {
            throw new Error("Invalid user.");
          }
          user.createdEvents.push(event);
          await user.save();

          return { ...result._doc };
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
          const encryptedPassword = await bcrypt.hash(
            args.userInput.password,
            12
          );

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
    },
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.nnh0nvs.mongodb.net/${process.env.MONGO_DB}`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
