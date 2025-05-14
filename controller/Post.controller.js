import HTTPStatus from "../enum/HTTPStatus.js";
import Post from "../model/Post.model.js";
//create a post
export const createPost = async (req, res) => {
  try {
    const { title, content, tag } = req.body;
    if (!title || !content) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        message: "Please provide title and content",
      });
    }

    const post = await Post.create({
      title,
      content,
      tag,
    });
    if (!post) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        message: "Post upload not finished!",
      });
    }

    res
      .status(HTTPStatus.CREATED)
      .json({ message: "Post created successfully!", post: post });
  } catch (error) {
    console.log(`Error in create Post method => ${error}`);
    res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

//delete a post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;


    // Check if post exists and user has permission (if needed)
    const post = await Post.findById(id);
    if (!post) {
      return res.status(HTTPStatus.NOT_FOUND).json({
        success: false,
        message: "Post not found",
      });
    }

    // Optional: Add authorization check here if needed
    // if (post.user.toString() !== req.user.id) {
    //   return res.status(HTTPStatus.FORBIDDEN).json({
    //     success: false,
    //     message: "Not authorized to delete this post",
    //   });
    // }

    // Delete the post
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Post could not be deleted due to server error",
      });
    }

    res.status(HTTPStatus.OK).json({
      success: true,
      message: "Post deleted successfully",
      postId: deletedPost._id, // Return the ID of deleted post for reference
    });
  } catch (error) {
    console.error(`Error in deletePost method => ${error}`);

    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to delete post",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

//update a post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tag } = req.body;

    // Validate required fields
    if (!title?.trim() || !content?.trim()) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        success: false,
        message: "Title and content are required",
      });
    }

 

    // Find and update the post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        content: content.trim(),
        tag: tag?.trim(),
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Run model validations on update
      }
    );

    if (!updatedPost) {
      return res.status(HTTPStatus.NOT_FOUND).json({
        success: false,
        message: "Post not found or could not be updated",
      });
    }

    res.status(HTTPStatus.OK).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error(`Error in updatePost method => ${error}`);

    // Handle specific Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update post",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
//read a post
export const getPost = async (req, res) => {
  try {
    const id = req.params.id;
    const postExisted = await Post.findById(id);
    if (!postExisted) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ message: "Post not found" });
    }

    res.status(HTTPStatus.OK).json({ Post: postExisted });
  } catch (error) {
    console.log(`Error in get a Post method => ${error}`);
    res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};
//get all posts
export const getAllPost = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [posts, totalCount] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(),
    ]);

    res.status(HTTPStatus.OK).json({
      posts,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    });
  } catch (error) {
    console.error(`Error in getAllPost method => ${error}`);
    res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

//get by tags
export const getByTagPost = async (req, res) => {
  try {
    const tag = req.params.tag;
    if (!tag) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ message: "Tag is required" });
    }

    const posts = await Post.find({ tag: tag }).sort({ createdAt: -1 });

    res.status(HTTPStatus.OK).json({ posts });
  } catch (error) {
    console.log(`Error in get by tags Post method => ${error}`);
    res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

//get by title
export const getByTitlePost = async (req, res) => {
  try {
    const title = req.params.title;
    if (!title) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ message: "Title is required" });
    }

    const posts = await Post.find({
      title: { $regex: title, $options: "i" }, // case-insensitive
    }).sort({ createdAt: -1 });

    res.status(HTTPStatus.OK).json({ posts });
  } catch (error) {
    console.log(`Error in get by title Post method => ${error}`);
    res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};
