const paginate = require("../../common/paginate");
const ProductModel = require("../models/product")
const CategoryModel = require("../models/category")
const fs = require('fs');
const slug = require('slug');
const path = require('path')

const index = async (req, res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = limit*(page-1);

    const totalProduct = await ProductModel.countDocuments();
    const totalPage = Math.ceil(totalProduct / limit)
    const pages = paginate(page, totalPage);

    const products = await ProductModel.find().populate({path : 'cat_id'}).skip(skip).limit(limit).sort({_id : - 1}) 
    res.render('admin/products/product', {
        page,
        totalPage,
        pages,
        products,
    })
}
const create = async (req, res)=>{
    const category = await CategoryModel.find();
    
    res.render("admin/products/add_product",{
        category
    })
}
const store = (req, res)=>{
    const body = req.body;
    const file = req.file;

    const prd = {
        description: body.description,
        price: body.price,
        cat_id: body.cat_id,
        status: body.status,
        featured: body.featured === "on",
        promotion: body.promotion,
        warranty: body.warranty,
        accessories: body.accessories,
        is_stock: body.is_stock,
        name: body.name,
        slug: slug(body.name),
    }

    if(file){
        prd["thumbnail"] = "products/"+file.originalname;
        fs.renameSync(file.path, path.resolve("src/public/images/products/"+file.originalname))
    }
    new ProductModel(prd).save();
    res.redirect('/admin/products')
}
const edit = async (req, res)=>{
    const id = req.params.id;
    if(!id) res.redirect('/admin/products')
    const category = await CategoryModel.find();
    const product = await ProductModel.findById(id);
    res.render('admin/products/edit_product', {
        category,
        product,
    })
}
const update = async (req, res)=>{
    const body  = req.body;
    const file = req.file;
   
    const prd = {
        description: body.description,
        price: body.price,
        cat_id: body.cat_id,
        status: body.status,
        featured: body.featured === "on",
        promotion: body.promotion,
        warranty: body.warranty,
        accessories: body.accessories,
        is_stock: body.is_stock,
        name: body.name,
        slug: slug(body.name),
    }

    if(file){
        prd["thumbnail"] = 'products/'+file.originalname;
        fs.renameSync(file.path , path.resolve(`src/public/images/${prd["thumbnail"]}`));
    }
    await ProductModel.updateOne({_id : req.params.id}, {$set : prd})

    res.redirect('/admin/products');
}
const del = async (req, res)=>{
    const id = req.params.id;
    await ProductModel.deleteOne({_id : id});
    res.redirect("/admin/products")
}

module.exports = {
    index,
    create,
    store,
    edit,
    update,
    del
}