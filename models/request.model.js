const mongoose = require('mongoose');
const crypto = require('crypto');
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
    priority:{
        default:0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Request', requestSchema);
