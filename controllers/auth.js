import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const register = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    imageUrl,
    friends,
    location,
    occupation,
  } = req.body;

  // Hashing the password using bcrypt.
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // Creating a new user object.
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: passwordHash,
    imageUrl,
    friends,
    location,
    occupation,
    viewedProfile: Math.floor(Math.random() * 10000),
    impressions: Math.floor(Math.random() * 10000),
  });
  try {
    // Saving the user to the DB.
    const savedUser = await newUser.save();

    // Sending the saved user back to the client.
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Fetching the user by the email.
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User doesn't exist!" });
    }

    // Comparing the client password with the hashed password from the DB.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Creating a token for the user.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Deleting the password before sending the user info to the client.
    delete user.password;
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
