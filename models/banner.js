const Mongoose = require('mongoose');
const { Schema } = Mongoose;

const BannerSchema = new Schema({
  desktopImage: {
    type: String,
    required: true,
  },
  mobileImage: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "",
  },
  headline: {
    type: String,
    default: "",
  },
  subheadline: {
    type: String,
    default: "",
  },
  align: {
    type: String,
    enum: ["left", "center", "right"],
    default: "left",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model('Banner', BannerSchema);
