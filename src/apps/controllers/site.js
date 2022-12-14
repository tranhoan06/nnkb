const paginate = require("../../common/paginate");

const CategoryModel = require("../models/category");
const CommentModel = require("../models/comment");
const ProductModel = require("../models/product");

const transporter = require("../../common/transporter");
const config = require("config");
const ejs = require("ejs");
const path = require("path");


const home = async (req, res)=>{
    const FeaturedProducts = await ProductModel.find({
        is_stock : true,
        featured : true
    }).limit(6)
    const LatestProducts = await ProductModel.find({
        is_stock : true,
    }).sort({_id : -1}).limit(6)
    res.render('site/index', {
        FeaturedProducts,
        LatestProducts
    })
}

const category = async (req, res)=>{
    const { id, slug } = req.params;
    const { title } = await CategoryModel.findById(id);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = limit*(page-1);
    const totalProduct = await ProductModel.find({cat_id : id}).countDocuments();
    const totalPage = Math.ceil(totalProduct/limit);
    const pages = paginate(page, totalPage);
    const products = await ProductModel.find({cat_id : id}).skip(skip).limit(limit).sort({id : -1});
    res.render('site/category', {
        title,
        page,
        pages,
        totalPage,
        products,
        totalProduct,
        slug,
        id
    })
}

const product = async (req, res)=>{
    const {id, slug} = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.page) || 10;
    const skip = limit*(page-1);
    const totalComment = await CommentModel.find({prd_id : id}).countDocuments();
    const totalPage = Math.ceil(totalComment/limit)
    const pages = paginate(page, totalPage)
    const product = await ProductModel.findById(id);
    const comments = await CommentModel.find({prd_id : id}).skip(skip).limit(limit).sort({_id : -1});
    res.render('site/product',{
        product,
        comments,
        page,
        pages,
        totalPage,
        slug,
        id
    })
}
const comment = async (req, res)=>{
    const id = req.params.id;
    const full_name = req.body.full_name;
    const body = req.body.body;
    const email = req.body.email;
    const comment = {
        email : email,
        prd_id : id,
        body : body,
        full_name : full_name,
    }
    await new CommentModel(comment).save();

    res.redirect(req.path);
}
const search = async (req, res)=>{
    const { keyword } = req.body;
    const filter = {}
    if(keyword){
        filter.$text = { $search : keyword}
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = limit*(page-1);
    
    const totalProduct = await ProductModel.find(filter).countDocuments();
    const totalPage = Math.ceil(totalProduct/limit);
    const pages = paginate(page, totalPage);
    const products = await ProductModel.find(filter).skip(skip).limit(limit).sort({_id : -1})

    res.render('site/search',{
        page,
        pages,
        keyword,
        products,
        totalPage,
        totalProduct
    })
}
const cart = (req, res)=>{
    let products = req.session.cart;
    const totalPrice = products.reduce((total, item)=> total += item.price*item.qty , 0)
    res.render("site/cart", {
        items : products, 
        totalPrice
    })
}
const addToCart = async (req, res)=>{
    const body = req.body;
    let items = req.session.cart;
    let isUpdate = false;
    items.map(item =>{
        if(item.id == body.id){
            isUpdate = true;
            item.qty += parseInt(body.qty)
        }
        return item;
    })
    if(!isUpdate){
        const product = await ProductModel.findById(body.id);
        items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.thumbnail,
            qty: parseInt(body.qty),
        });
    }
    req.session.cart = items;
    res.redirect('/cart')
}
const delToCart = (req, res)=>{
    const { id } = req.params;
    const items = req.session.cart;
    items.map((item, index)=>{
        if(item.id == id){
            items.splice(index, 1);
        }
        return item;
    })
    req.session.cart = items;
    res.redirect('/cart')
}
const updateCart = (req, res)=>{
    const { products } = req.body;
    const items = req.session.cart;
    items.map((item)=>{
        if(products[item.id]){
            item.qty = parseInt(products[item.id]["qty"])
        }
        return item;
    })
    req.session.cart = items;
    res.redirect('/cart')
}
const order = async (req, res)=>{
    const items = req.session.cart;
    const body = req.body;
    
    const viewPath = req.app.get('views');

    const html = await ejs.renderFile(
        path.join(viewPath, "site/email-order.ejs"),
        {
            name: body.name,
            phone: body.phone,
            mail: body.mail,
            add: body.add,
            totalPrice: 0,
            items,
        }
    )
    await transporter.sendMail({
        to: body.mail,
        from: "Vietpro Shop",
        subject: "Xác nhận đơn hàng từ Vietpro Shop",
        html,
    });
    res.redirect("/success");
}


const success = (req, res) =>{
    res.render("site/success");
}

module.exports = {
    home,
    category,
    product,
    comment,
    search,
    cart,
    success,
    addToCart,
    delToCart,
    updateCart,
    order,
}