import User from "../user/user.model.js";


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


export const existsUserById = async (id = "") => {
  const existsUser = await User.findById(id);
  if (!existsUser) {
    throw new Error(`The ID ${id} does not exist in the database`);
  }
};
