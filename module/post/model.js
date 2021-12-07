const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
  id: { type: String },
  username: { type: String },
  fullName: { type: String },
  profilePicture: { type: String },
  followedBy: { type: String },
  postsCount: { type: String },
}, {
  timestamps: true,
});

const LocationSchema = new mongoose.Schema({
  id: { type: String },
  address: { type: String },
  name: { type: String },
  gps: {
    type: { type: String },
    coordinates: { type: [], default: undefined },
  },
}, {
  timestamps: true,
});

const ClasificationSchema = new Schema({
  probability: Number,
  className: String,
});

const PostSchema = new Schema({
  caption: String,
  id: String,
  mediaUrl: String,
  permalink: String,
  likeCount: Number,
  commentsCount: Number,
  source: String,

  user: UserSchema,
  location: LocationSchema,
  likers: [UserSchema],
  classification: [ClasificationSchema],
}, {
  timestamps: true,
});

const PostModel = mongoose.model('postRaw', PostSchema);

module.exports = {
  PostModel,
};
