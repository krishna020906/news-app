// backend/models/Comment.ts
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    newsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
      index: true,
      required: true,
    },
    userUid: {
      type: String,
      index: true,
      required: true,
    },
    userName: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// For fast listing per post
CommentSchema.index({ newsId: 1, createdAt: -1 });

export default mongoose.models.Comment ||
  mongoose.model("Comment", CommentSchema);
