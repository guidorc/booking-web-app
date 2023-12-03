const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

module.exports = {
  signup: async (args) => {
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
  signin: async (args) => {
    try {
      // auth check
      const user = await User.findOne({ email: args.userInput.email });
      if (!user) {
        throw new Error("Invalid Credentials");
      }
      const validPassword = await bcrypt.compare(
        args.userInput.password,
        user.password
      );
      console.log(validPassword);
      if (!validPassword) {
        throw new Error("Invalid Credentials");
      }

      // create jwt token
      const token = await jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        process.env.JWT_KEY,
        {
          expiresIn: process.env.JWT_EXPIRATION_TIME,
        }
      );

      // return jwt token
      return {
        userId: user.id,
        token,
        tokenExpiration: process.env.TOKEN_EXPIRATION,
      };
    } catch (err) {
      throw err;
    }
  },
};
