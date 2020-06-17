
const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema(
    {
        body: {
            type: String
        },
        sender: {
            type: String
        },
        senderName: {
            type: String
        },
        requestId: {
            type: String
        },
        roomId:{
            type:String
        },
        receiver: {
            type: String
        }
    },
    {
        timestamps: true
    });
module.exports = mongoose.model('Chat', chatSchema);