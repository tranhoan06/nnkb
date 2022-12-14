const mongoose = require('../../common/database')();

const ProductSchema = new mongoose.Schema({
    thumbnail :{
        type: String,
        default : null,
    },
    description :{
        type: String,
        default : null,
    },
    price :{
        type: Number,
        default : 0,
    },
    cat_id :{
        type: mongoose.Types.ObjectId,
        ref : "Category",
        required : true,
    },
    status :{
        type: String,
        default : null,
    },
    featured :{
        type: Boolean,
        default : false,
    },
    promotion :{
        type: String,
        default : null,
    },
    warranty :{
        type: String,
        default : null,
    },
    accessories :{
        type: String,
        default : null,
    },
    is_stock :{
        type: Boolean,
        default : false,
    },
    name :{
        type: String,
        default : null,
        text : true,
    },
    slug :{
        type: String,
        default : null,
    },
}, {
    timestamps: true,
});

const ProductModel = mongoose.model('Product', ProductSchema, 'products');

module.exports = ProductModel;