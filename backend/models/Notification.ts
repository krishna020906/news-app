import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
{
  recipientUid: {
    type: String,
    required: true,
    index: true,
  },

  actorUid: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: [
      "post_like",
      "post_comment",
      "comment_like",
      "comment_reply",
      "follow"
    ],
    required: true,
  },

  entityId: String, // postId or commentId

  isRead: {
    type: Boolean,
    default: false,
  }

},
{ timestamps: true }
);

export default mongoose.models.Notification ||
mongoose.model("Notification", NotificationSchema);