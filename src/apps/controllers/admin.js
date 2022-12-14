const ProductModel = require('./../models/product');
const UserModel = require('./../models/user');
const CommentModel = require('./../models/comment');
const index = async (req, res)=>{
    const totalProduct = await ProductModel.countDocuments();
    const totalUser = await UserModel.countDocuments();
    const totalComment = await CommentModel.countDocuments();
    res.render('admin/dashboard', {
        totalProduct,
        totalUser,
        totalComment,
    })
}
const logout = (req, res)=>{
    req.session.destroy();
    res.redirect("/admin/login", {data : {}});
}
module.exports = {
    index,
    logout,
}