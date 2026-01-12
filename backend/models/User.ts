// backend/models/User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      index: true,
    },

    // For personalized news
    name: {
      type: String,
      trim: true,
    },
    profession: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    locality: {
      type: String,
      trim: true,
    },
    hobbies: { type: [String], default: [] },
    age: {
      type: Number,
      min: 13,
      max: 120,
    },
    // savedNews: [
    // {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "News",
    // },


  savedNews: {
    type: [String],
    default: [],
  },
  streakCount: {
    type: Number,
    default: 0
  },
  lastReadAt: {
    type: Date,
    default: null
  },
  
  followers: {
    type: [String], // user uids following THIS user
    default: [],
  },

  followingCreators: {
    type: [String], // creator uids this user follows
    default: [],
  },




  


    // Optional profile info (e.g. from Firebase or your own profile form)
    photoUrl: {
      type: String,
    },

    // Permission level in your app
    role: {
      type: String,
      enum: ["user", "admin", "editor"],
      default: "user",
      index: true,
    },

    // Account status
    isBanned: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: {
      type: Date,
    },
  },

  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);








// // models/User.ts
// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   uid: { type: String, required: true, unique: true },
//   email: { type: String },
//   role: { type: String, default: "user" }, // 'user' | 'admin'
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.models.User || mongoose.model("User", UserSchema);
