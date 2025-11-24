// backend/models/Reaction.ts
import mongoose from "mongoose";

const ReactionSchema = new mongoose.Schema(
  {
    newsId: { type: mongoose.Schema.Types.ObjectId, ref: "News", index: true },
    userUid: { type: String, index: true },
    type: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One reaction per (user, news)
ReactionSchema.index({ newsId: 1, userUid: 1 }, { unique: true });

export default mongoose.models.Reaction ||
  mongoose.model("Reaction", ReactionSchema);
