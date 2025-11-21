// backend/models/News.ts
import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    // Short headline (we enforce word limit on frontend)
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Full article body (word limit handled on frontend)
    content: {
      type: String,
      required: true,
    },

    // Cloudinary media info
    mediaUrl: {
      type: String, // secure_url from Cloudinary
    },
    mediaPublicId: {
      type: String, // public_id from Cloudinary (if you capture it later)
    },
    mediaType: {
      type: String,
      enum: ["image", "video", "none"],
      default: "none",
    },

    // News classification
    category: {
      type: String,
      default: "general",
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // Author info (from Firebase auth)
    authorUid: {
      type: String,
      required: true,
      index: true,
    },
    authorEmail: {
      type: String,
    },
    authorName: {
      type: String,
    },

    // Publishing state
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Basic engagement stats
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// For feeds sorted by newest first
NewsSchema.index({ createdAt: -1 });

export default mongoose.models.News || mongoose.model("News", NewsSchema);







// // models/News.ts
// import mongoose from "mongoose";

// const NewsSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   content: { type: String, required: true },
//   authorUid: { type: String, required: true },
//   authorEmail: { type: String },
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.models.News || mongoose.model("News", NewsSchema);
