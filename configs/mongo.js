import mongoose from "mongoose";
import User from "../src/user/user.model.js"
import { hash } from "argon2";

export const dbConection = async () => {
  try {
    mongoose.connection.on("error", () => {
      console.log("MongoDB | could not be connected to MongoDB");
      mongoose.disconnect();
    });

    mongoose.connection.on("connecting", () => {
      console.log("MongoDB | Try connection");
    });
    mongoose.connection.on("connected", () => {
      console.log("MongoDB | connected to MongoDB");
    });
    mongoose.connection.on("open", () => {
      console.log("MongoDB | connected to database");
    });
    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB | reconnected to MongoDB");
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB | disconnected to database");
    });

    await mongoose.connect(process.env.URI_MONGO, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 50,
    }).then(createDeafultUser())
  } catch (error) {
    console.log("Database connection failded", error);
  }
};

const createDeafultUser = async() => {
  try {
  const user = await User.findOne({ username: 'admin' });

    if (!user) {
      
      const cryptedPassword = await hash('admin1234');

     
      const defaultUser = new User({
        name: 'admin',
        username: 'admin',
        surname: 'admin',
        email: 'admin@gmail.com',
        password: cryptedPassword
      });

      await defaultUser.save();
      console.log('Default user created');
    } else {
      console.log('Default user already exists');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}