const paginate = require("../../common/paginate");
const CategoryModel = require("../models/category")
const slug = require('slug');

const index = async (req, res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = limit*(page - 1)

    const totalCategory = await CategoryModel.countDocuments();
    const totalPage = Math.ceil(totalCategory/limit);

    const pages = paginate(page, totalPage);

    const categories = await CategoryModel.find().skip(skip).limit(limit).sort({_id : -1});
    res.render('admin/categories/category', {
        page,
        pages,
        totalPage,
        categories
    })
}
const create = (req, res )=>{
    res.render("admin/categories/add_category", {data : {}})
}

const store = async (req, res)=>{
    const ctg = {
        title : req.body.title,
    }
    let err = "";
    if(ctg.title == ''){
        err = "Không Được Bỏ Trống!";
        return res.render("admin/categories/add_category", {data : {err}})
    }else{
        ctg["slug"] = slug(ctg.title);
        const CategoryExist = await CategoryModel.exists({
            slug : ctg.slug
        });
        if(CategoryExist){
            err = "Danh mục đã tồn tại !"
            return res.render("admin/categories/add_category", {
                data : {err}
            })
        }
    }
    new CategoryModel(ctg).save();
    res.redirect('/admin/category');
}

const edit = async (req, res)=>{
    const id = req.params.id;
    const category = await CategoryModel.findById(id);
    res.render('admin/categories/edit_category', {
        data : {}, 
        category
    })
}

const update = async (req, res)=>{
    const id = req.params.id;
    const body = req.body;
    const ctg = {
        title : body.title.trim(),
    }
    let err = "";
    if(ctg.title == ''){
        err = "Không Được Bỏ Trống!";
        return res.render("admin/categories/edit_category", {data : {err}})
    }else{
        ctg["slug"] = slug(ctg.title);
        const CategoryExist = await CategoryModel.exists({
            slug : ctg.slug
        });
        if(CategoryExist){
            err = "Danh mục đã tồn tại !"
            const category = await CategoryModel.findById(id)
            return res.render("admin/categories/edit_category", {
                data : {err},
                category,
            })
        }
    }
    await CategoryModel.updateOne({_id : id}, ctg)
    res.redirect("/admin/category");
}
const del = async (req, res)=>{
    const {id} = req.params;
    await CategoryModel.deleteOne({_id : id});
    res.redirect("/admin/category")
}
module.exports = {
    index,
    create,
    store,
    edit,
    update,
    del
}