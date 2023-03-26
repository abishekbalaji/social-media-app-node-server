import User from "../models/User.js";

const formatFriends = async (user) => {
  const friends = await Promise.all(
    user.friends.map(async (id) => await User.findById(id))
  );

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

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filetr((id) => id != userId);
    } else {
      user.friends.push(friendId);
      friend.friends.push(userId);
    }

    await user.save();
    await friend.save();

    const friends = formatFriends(user);
    res.status(200).json(friends);
    
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
