// models/News.ts
import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorUid: { type: String, required: true },
  authorEmail: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.News || mongoose.model("News", NewsSchema);
