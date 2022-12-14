
const mongoose = require("../../common/database")();
const messageSchema = new mongoose.Schema(
    {
        body: {
            type: String,
            default: null,
        },
        room_id: {
            type: mongoose.Types.ObjectId,
            ref: "Room",
        },
        author_id: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);
const messageModel = mongoose.model("Message", messageSchema, "messages");
module.exports = messageModel;
