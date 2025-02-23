import Publication from "../publication/publication.model.js";
import Comment from "./comment.model.js";

export const saveComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const data = req.body;
    const authenticatedUser = req.user;

    const post = await Publication.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({
        success: false,
        msg: "publication not found",
      });
    }

    const comment = new Comment({
      ...data,
      author: authenticatedUser.id,
      publication: post.id,
    });

    await comment.save();
    post.comments.push(comment.id);
    await post.save();

    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error saving Publication",
      error: error.message,
    });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const [total, comments] = await Promise.all([
      Comment.countDocuments({ publication: postId, state: true }),
      Comment.find({ publication: postId, state: true })
        .skip(Number(offset))
        .limit(Number(limit))
        .populate({
          path: "author",
          select: "username",
        })
        .populate({
          path: "publication",
          select: "title",
        }),
    ]);

    if (total === 0) {
      return res.status(200).json({
        success: true,
        total,
        comments: [],
        msg: "This post has no comments",
      });
    }

    res.status(200).json({
      success: true,
      comments: comments.map((comment) => ({
        content: comment.content,
        publicationTitle: comment.publication
          ? comment.publication.title
          : "No Title",
        author: comment.author.username,
        createdAt: comment.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error fetching comments",
      error: error.message,
    });
  }
};

export const getCommentsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, offset = 0 } = req.query;

    const [total, comments] = await Promise.all([
      Comment.countDocuments({ author: userId, state: true }),
      Comment.find({ author: userId, state: true })
        .skip(Number(offset))
        .limit(Number(limit))
        .populate({
          path: "author",
          select: "username",
        })
        .populate({
          path: "publication",
          select: "title",
        }),
    ]);

    if (total === 0) {
      return res.status(200).json({
        success: true,
        total,
        comments: [],
        msg: "You haven't made any comments",
      });
    }

    res.status(200).json({
      success: true,
      comments: comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        publicationTitle: comment.publication
          ? comment.publication.title
          : "No Title",
        author: comment.author.username,
        createdAt: comment.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error fetching comments user",
      error: error.message,
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, author, publication } = req.body;
    const authenticatedUser = req.user;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        msg: "Comment not found",
      });
    }

    if (author !== undefined) {
      return res.status(400).json({
        success: false,
        msg: "Modifying the author is not allowed",
      });
    }

    if (publication !== undefined) {
      return res.status(400).json({
        success: false,
        msg: "Modifying comments directly is not allowed",
      });
    }

    if (comment.author.toString() !== authenticatedUser.id) {
      return res.status(403).json({
        success: false,
        msg: "You are not authorized to update this comment",
      });
    }

    comment.content = content || comment.content;

    const updatedComment = await comment.save();

    res.status(200).json({
      success: true,
      msg: "Comment updated successfully",
      updatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error updating the comment",
      error: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const authenticatedUser = req.user;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        msg: "Comment not found",
      });
    }

    if (comment.author.toString() !== authenticatedUser.id) {
      return res.status(403).json({
        success: false,
        msg: "You are not authorized to delete this comment",
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    );

    await Publication.findByIdAndUpdate(
      comment.publication.toString(),
      { $pull: { comments: id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      msg: "Comment removed successfully",
      updatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error deliting comment",
      error: error.message,
    });
  }
};
