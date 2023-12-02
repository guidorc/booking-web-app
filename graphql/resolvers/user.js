const bcrypt = require("bcrypt");

const User = require("../../models/user");

module.exports = {
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
};
