import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res, next) => {
  const { userId, description, imageUrl } = req.body;

  try {
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      imageUrl,
      userImageUrl: user.imageUrl,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const posts = await Post.find();

    res.status(201).json(posts);

  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getFeedPosts = async (req, res, next) => {};

export const getUserPosts = async (req, res, next) => {};

export const toggleLike = async (req, res, next) => {};
