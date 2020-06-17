const mongoose = require('mongoose');
// request schema
const requestSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },

    longitude: {
      type: String,

    },
    latitude: {
      type: String,
    },
    tags: [{
      type: String
    }],
    users: [{
      type: String, default: []
    }],
    priority: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      default: 'General'
    },
    images: [{
      type: String, default: []
    }],
    doneBy: {
      type: String,
      default: ''
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Request', requestSchema);
