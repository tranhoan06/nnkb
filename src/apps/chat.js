const socketio = require('socket.io')
const app = require("./app");
const shareSession = require("express-socket.io-session");
const roomModel = require("./models/room");
const messageModel = require("./models/message");
const userRoom = [];
const Exist = (socketID)=>{
    
    if(userRoom.filter(user => user.socketID == socketID).length != 0)
        return true;
    return false;
}
module.exports = (server) => {
    const io = socketio(server);
    io.use(shareSession(app.session));
    io.on("connection", (socket) => {
        console.log("User connect :" + socket.id)

        socket.on("START_CONVERSATION", async ({ type, id }) => {

            // Lấy ra ID của bản thân mình từ thông tin đăng nhập lưu trong Session
            const currentUserId = socket.handshake.session._id;

            // Tạo một mảng UserID với ID đầu tiên chính là của chủ Room
            const users = [currentUserId];

            // Khai báo biến room để lưu lại thông tin Room cuối cùng sẽ trả về cho Client
            let room;

            // Nếu type là User thì tìm Room giữa 2 User
            if (type === "user") {
                users.push(id);
                room = await roomModel
                    .findOne({
                        users: { $all: users },
                        type: "private",
                    })
                    .populate("users");
            }

            // Nếu type là Room thì tìm Room với ID
            // kèm theo điều kiện phải có User hiện tại trong đó
            if (type === "room") {
                room = await roomModel
                    .findOne({
                        users: { $all: users },
                        _id: id,
                    })
                    .populate("users");
            }

            // Nếu Room không tồn tại và type là User
            // thì sẽ tạo ra Room mới
            if (!room && type === "user") {
                room = await new roomModel({
                    users: users,
                }).save();
                room = await roomModel.findById(room._id).populate("users");
            }

            // Đến đây, nếu như đã có Room thì trả Room về cho Client
            if (room) {
                socket.emit("START_CONVERSATION_SUCCESS", { room });
            }


        });

        socket.on("NEW_MESSAGE", async ({ roomID, authorID, body }) => {
            const room = await roomModel.findById(roomID);
            if (!room) return;
            //
            if(!Exist(socket.id))
                userRoom.push({
                    socketID: socket.id,
                    authorID,
                    roomID,
                })

            //
            const mess = await messageModel({
                body,
                author_id: authorID,
                room_id: roomID,
            }).save();

            // socket.join(userRoom.socketID);

            socket.emit("RECIEVER_NEW_MESSAGE", { mess });

            userRoom.forEach(user => socket.to(user.socketID).emit("RECIEVER_NEW_MESSAGE", { mess }))
            
        });

        socket.on("GET_MESSAGE", async ({ roomID }) => {
            const messages = await messageModel
                .find({ room_id: roomID })
                .sort("_id");
            socket.emit("RECEIVER_MESSAGE", { messages });
        });


    })
}