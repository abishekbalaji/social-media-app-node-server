import User from "../models/User.js";

const formatFriends = async (user) => {
  // Fetching the user info of all the users in the current user's friend list.
  const friends = await Promise.all(
    user.friends.map(async (id) => await User.findById(id))
  );

  // Returning a formatted version of the user info list.
  return friends.map((friend) => {
    const { _id, firstName, lastName, occupation, location, imageUrl } = friend;
    return { _id, firstName, lastName, occupation, location, imageUrl };
  });
};

export const getUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    delete user.password;
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserFriends = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    // Getting the formatted friend list of the current user.
    const formattedFriends = formatFriends(user);

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const toggleFriend = async (req, res, next) => {
  const { id: userId, friendId } = req.params;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    // Removing from friend list if friendId is in friends list else adding.
    if (user.friends.includes(friendId)) {
      // Removing the friend from the current user's fried list.
      user.friends = user.friends.filter((id) => id !== friendId);

      // Removing the user from the friend's friend list.
      friend.friends = friend.friends.filetr((id) => id != userId);
    } else {
      user.friends.push(friendId);
      friend.friends.push(userId);
    }

    await user.save();
    await friend.save();

    // Fetching and sending the current user's formatted friend list to the client for appropriate updation.
    const friends = formatFriends(user);
    res.status(200).json(friends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
