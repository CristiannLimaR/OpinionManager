import User from "../user/user.model.js";
import Category from "../category/category.model.js";

export const existsEmail = async (email = "", { req }) => {
    const userId = req.params.id; 
    const existEmail = await User.findOne({ email });

    if (existEmail && existEmail.id !== userId) {
        throw new Error(`Email ${email} is already used by another user`);
    }
};


export const existUsername = async (username = "", { req }) => {
    const userId = req.params.id; 
    const existUsername = await User.findOne({ username });

    if (existUsername && existUsername.id !== userId) {
        throw new Error(`Username ${username} is already used by another user`);
    }
};

export const existsCategoryById = async (id = '') => {
  const existsCategory = await Category.findById(id);
  if (!existsCategory) {
    throw new Error(`The ID ${id} does not exist in the database`);
  }
}

export const existsUserById = async (id = "") => {
  const existsUser = await User.findById(id);
  if (!existsUser) {
    throw new Error(`The ID ${id} does not exist in the database`);
  }
};
