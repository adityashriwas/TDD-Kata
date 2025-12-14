import mongoose from "mongoose";
import { SWEET_CATEGORIES } from "../constants/sweetCategories.js";

const sweetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    category: {
      type: String,
      required: true,
      enum: SWEET_CATEGORIES,
      trim: true,
      maxlength: 50,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    sweetImage: {
      type: String,
      required: true,      
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
  },
  { timestamps: true }
);

export const Sweet = mongoose.model("Sweet", sweetSchema);
