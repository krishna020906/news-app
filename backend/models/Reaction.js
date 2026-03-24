// models/Reaction.js
import mongoose from "mongoose";

const ReactionSchema = new mongoose.Schema({
  userId: String,
  newsId: mongoose.Schema.Types.ObjectId,
  type: {
    type: String,
    enum: ["hot_take", "insight", "funny", "mind_blown"],
  }
}, { timestamps: true });

export default mongoose.models.Reaction ||
  mongoose.model("Reaction", ReactionSchema);