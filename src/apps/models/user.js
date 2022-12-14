const mongoose = require('./../../common/database')();

const userSchema = mongoose.Schema({
    full_name : {
        type: String,
        default : null,
    },
    email :{
        type: String,
        unique : true,
    },
    password :{
        type: String,
        required : true,
    },
    role :{
        type: String,
        enum : ['member', 'admin'],
        default : 'member'
    },

});

const UserModel = mongoose.model("User", userSchema, "users");

module.exports = UserModel;