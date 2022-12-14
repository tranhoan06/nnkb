const CategoryModel = require('../models/category')
module.exports = async (req, res, next)=>{
    res.locals.categories = await CategoryModel.find();
    res.locals.totalCartItems = req.session.cart.reduce((total, item)=> total + parseInt(item.qty) , 0);
    res.locals.userID = req.session.userID;
    next();
}