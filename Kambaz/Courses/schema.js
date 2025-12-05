import mongoose from "mongoose";
import moduleSchema from "../Modules/schema.js";

const DEFAULT_IMAGE = "/images/NU_CMYK_Notched-N_motto_RW.png"

const courseSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    number: String,
    credits: Number,
    description: String,
    image: {
      type: String,
      default: DEFAULT_IMAGE,
    },
    modules: [moduleSchema],
  },
  { collection: "courses" }
);

export default courseSchema;
