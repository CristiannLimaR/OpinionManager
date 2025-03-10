import Category from "../category/category.model.js";
import Publication from "./publication.model.js";
import Comment from "../comment/comment.model.js";

export const savePublication = async (req, res) => {
  try {
    const data = req.body;
    const authenticatedUser = req.user;
    const category = await Category.findOne({ name: data.category });

    if (!category) {
      return res.status(404).json({
        success: false,
        msg: "category not found",
      });
    }

    const publication = new Publication({
      ...data,
      category: category.id,
      author: authenticatedUser.id,
    });

    await publication.save();

    res.status(200).json({
      success: true,
      publication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error saving Publication",
      error,
    });
  }
};

export const getPublications = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const [total, publications] = await Promise.all([
      Publication.countDocuments({ state: true }),
      Publication.find({ state: true })
        .skip(Number(offset))
        .limit(Number(limit))
        .populate("category", "name")
        .populate("author", "username")
        .populate({
          path: "comments",
          match: { state: true },
          populate: { path: "author", select: "username" },
        })
        .sort({ createdAt: -1 }),
    ]);

    const publicationsWithUsername = publications.map((publication) => ({
      ...publication.toObject(),
      category: publication.category
        ? publication.category.name
        : "Category not found",
      author: publication.author
        ? publication.author.username
        : "Author not found",
      comments:
        publication.comments.length > 0
          ? publication.comments.map((comment) => ({
              content: comment.content,
              author: comment.author ? comment.author.username : "Unknown User",
            }))
          : [],
    }));

    res.status(200).json({
      success: true,
      total,
      posts: publicationsWithUsername,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error getting publications",
      error: error.message,
    });
  }
};

export const getPublicationsById = async (req, res) => {
  try {
    const { id } = req.params;
    const publication = await Publication.findById(id)
      .populate("category", "name")
      .populate("author", "username")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username" },
      })
      .sort({ createdAt: -1 });

    const publicationWithUsername = {
      ...publication.toObject(),
      category: publication.category
        ? publication.category.name
        : "Category not found",
      author: publication.author
        ? publication.author.username
        : "Author not found",
      comments:
        publication.comments.length > 0
          ? publication.comments.map((comment) => ({
              content: comment.content,
              author: comment.user ? comment.author.username : "Unknown User",
            }))
          : [],
    };

    if (!publication) {
      return res.status(404).json({
        success: false,
        msg: "Publication not found",
      });
    }

    res.status(200).json({
      success: true,
      publication: publicationWithUsername,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error getting publication",
      error: error.message,
    });
  }
};

export const updatePublication = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author, comments, category } = req.body;

    const newCategory = await Category.findOne({ name: category });

    if (!newCategory) {
      return res.status(404).json({
        success: false,
        msg: "category not found",
      });
    }

    if (author !== undefined) {
      return res.status(400).json({
        success: false,
        msg: "Modifying the author is not allowed",
      });
    }

    if (comments !== undefined) {
      return res.status(400).json({
        success: false,
        msg: "Modifying comments directly is not allowed",
      });
    }

    const publication = await Publication.findById(id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        msg: "Publication not found",
      });
    }

    if (publication.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        msg: "You are not authorized to edit this publication",
      });
    }

    publication.title = title || publication.title;
    publication.content = content || publication.content;
    publication.category = newCategory || publication.category;

    const updatedPublication = await publication.save();

    res.status(200).json({
      success: false,
      msg: "Post updated successfully",
      updatedPublication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating the publication",
      error: error.message,
    });
  }
};

export const deletePublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    const authenticatedUser = req.user;

    if (!publication) {
      return res.status(404).json({
        success: false,
        msg: "Publication not found",
      });
    }

    if (publication.author.toString() !== authenticatedUser.id) {
      return res.status(403).json({
        message: "Unauthorized | You can only delete your publications ",
      });
    }

    await Comment.updateMany(
      { publication: publication.id },
      { $set: { state: false } }
    );

    const deletedPublication = await Publication.findByIdAndUpdate(
      publication.id,
      { state: false }
    );

    res.status(200).json({
      success: true,
      msg: "Publication and its comments deactivated successfully",
      deletedPublication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error deactivating the publication",
      error: error.message,
    });
  }
};
