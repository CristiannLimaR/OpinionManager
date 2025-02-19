import { Schema, model } from "mongoose";

const CategorieSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "The name is required"],
    },
    state: {
      type: Boolean,
      default: true,
    },
},

  {
    timestamps: true,
    versionKey: false,
  }
);

export default model('Categorie', CategorieSchema)