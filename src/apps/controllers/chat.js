const RoomModel = require('../models/room');
const UserModel = require("../models/user");
const chat = async (req, res)=>{
    const userID = req.session.userID;
    const users = await UserModel.find({
        _id : {$nin : [userID]}
    })
    const rooms = await RoomModel.find({
        users : {$all : [userID]}
    }).populate({path : 'users'})
    
    res.render('chat', {
        rooms,
        users
    })
}
module.exports = {
    chat
}