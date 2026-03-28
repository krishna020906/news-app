//backend/models/reaction.js
import mongoose from "mongoose";

const ReactionSchema = new mongoose.Schema(
  {
    newsId: { type: mongoose.Schema.Types.ObjectId, ref: "News", index: true },
    userUid: { type: String, index: true },

    type: {
      type: String,
      enum: [
        // 👍 Like system
        "like",
        "dislike",

        // 🎭 ReactionBar system
        "hot_take",
        "insight",
        "funny",
        "mind_blown",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

ReactionSchema.index(
  { newsId: 1, userUid: 1, type: 1 },
  { unique: true }
);

export default mongoose.models.Reaction ||
  mongoose.model("Reaction", ReactionSchema);
