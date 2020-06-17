
const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
    {
        sender: {
            type: String
        },
        senderName: {
            type: String
        },
        requestId: {
            type: String
        },
        requestTitle: {
            type: String
        },
        receiver:{
            type:String
        },
        requestUserId:{
            type:String
        },
        seen:{
            type:Number,
            default:0
        },
        type:{
            type:Number,
            default:0
        }
    },
    {
        timestamps: true
    });
module.exports = mongoose.model('Notification', notificationSchema);