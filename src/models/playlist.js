const mongoose = require("mongoose");

const PlaylistSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  songs: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("playlist", PlaylistSchema);
