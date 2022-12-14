const mongoose = require('../../common/database')();

const CommentSchema = new mongoose.Schema({
    email :{
        type : String,
        required: true,
    },
    prd_id :{
        type : mongoose.Types.ObjectId,
        ref : "Product",
        required : true,
    },
    body :{
        type : String,
        default: null,
        required : true,
    },
    full_name :{
        type : String,
        default : null,
    },
},{
    timestamps : true,
});

const CommentModel = mongoose.model('Comment', CommentSchema, 'comments')

module.exports = CommentModel;