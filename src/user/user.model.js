import { Schema, model } from "mongoose";

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "The name is required"],
    maxLength: [25, 'Cant be overcome 25 characters']
  },
  surname: {
    type: String,
    required: [true, 'Surname is required'],
    maxLength: [25, 'Cant be overcome 25 characters']
  },
  email: {
    type: String,
    required: [true, "The email is obligatory"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    maxLength: [25, 'Cant be overcome 25 characters'],
    unique: true
  },

  password: {
    type: String,
    required: [true, "The password is required"],
    minLength: 8
  },

  state: {
    type: Boolean,
    default: true,
  }
},

  {
    timestamps: true,
    versionKey: false
  }
)

export default model('User', UserSchema)