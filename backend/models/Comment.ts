// // backend/models/Comment.ts
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    newsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
      required: true,
      index: true,
    },

    userUid: {
      type: String,
      required: true,
      index: true,
    },

    userName: String,
    userEmail: String,

    text: {
      type: String,
      required: true,
      trim: true,
    },

    /* 👍 likes */
    likes: {
      type: [String], // userUid
      default: [],
    },

    /* 👎 dislikes */
    dislikes: {
      type: [String],
      default: [],
    },

    /* 💬 replies */
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

CommentSchema.index({ newsId: 1, createdAt: -1 });

export default mongoose.models.Comment ||
  mongoose.model("Comment", CommentSchema);






// import mongoose from "mongoose";

// const CommentSchema = new mongoose.Schema(
//   {
//     newsId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "News",
//       index: true,
//       required: true,
//     },
//     userUid: {
//       type: String,
//       index: true,
//       required: true,
//     },
//     userName: {
//       type: String,
//     },
//     userEmail: {
//       type: String,
//     },
//     text: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true, // createdAt, updatedAt
//   }
// );

// // For fast listing per post
// CommentSchema.index({ newsId: 1, createdAt: -1 });

// export default mongoose.models.Comment ||
//   mongoose.model("Comment", CommentSchema);
