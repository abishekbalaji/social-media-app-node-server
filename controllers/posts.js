import Post from "../models/Post.js";
import User from "../models/User.js";

// Create
export const createPost = async (req, res, next) => {
  const { userId, description, imageUrl } = req.body;

  try {
    // Fetching the user from DB to collect user info needed for the post.
    const user = await User.findById(userId);

    // Creating a new Post object.
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

    // Saving the post to the DB.
    await newPost.save();

    // Fetching all the posts to send them to the frontend to update the feed.
    const posts = await Post.find();

    res.status(201).json(posts);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Read
export const getFeedPosts = async (req, res, next) => {
  try {
    const posts = Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const posts = await Post.find({ userId });
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const toggleLike = async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);

    // Checking if the user has liked the post.
    const isLiked = post.likes.get(userId);

    // If liked, delete the user from likes map; else add the user.
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    // Update the DB with new likes and get back the updated post info.
    const updatedPost = Post.findByIdAndUpdate(
      postId,
      { likes: post.likes },
      { new: true } // Setting this to get back the updated info.
    );

    // Send the updated post info to the client.
    res.status(200).json(updatedPost);
  } catch (error) {}
};
