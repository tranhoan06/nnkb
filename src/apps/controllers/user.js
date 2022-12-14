const UserModel = require("../models/user");
const RoomModel = require("../models/room");
const paginate = require("../../common/paginate");
const index = async (req, res)=>{
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    
    const skip = limit*(page - 1);
    const totalUser = await UserModel.countDocuments();
    const totalPage = Math.ceil(totalUser/limit);
    
    const pages = paginate(page, totalPage);
    const users = await UserModel.find().skip(skip).limit(limit).sort({_id : 1});
    res.render('admin/users/user', {
        users,
        page,
        pages,
        totalPage
    });
}
const create = (req, res )=>{
    res.render('admin/users/add_user', {
        data : {},
    })
}
const store = async (req, res)=>{
    const body = req.body;
    let err = '';
    if(body.password != body.re_password){
        err = "Mật Khẩu Không Khớp Với Nhau !";
        return res.render("admin/users/add_user", {data : {err}})
    }
    const user = {
        full_name : body.full_name.trim(),
        role : body.role == "1" ? "admin" : "member",
        password : body.password.trim(),
        email : body.email.trim(),
    }
    const UserExist = await UserModel.exists({email : user.email});
    if(UserExist){
        err = "Email Đã Tồn Tại !";
        return res.render("admin/users/add_user", {data : {err}})
    }
    new UserModel(user).save();
    res.redirect('/admin/users');
}
const edit = async (req, res)=>{
    const id = req.params.id;
    const user = await UserModel.findById(id);
    res.render("admin/users/edit_user", {
        user,
        data : {}
    });
}
const update = async (req, res)=>{
    const { id } = req.params;
    const body = req.body;
    let err = '';
    const UserByID =  await UserModel.findById(id);
    if(body.password != body.re_password){
        err = "Mật Khẩu Không Khớp Với Nhau !";
        return res.render("admin/users/edit_user", {
            data : {err}, 
            user : UserByID
        })
    }
    const user = {
        full_name : body.full_name.trim(),
        role : body.role == "1" ? "admin" : "member",
        password : body.password.trim(),
        email : body.email.trim(),
    }
    
    if(UserByID.email !== user.email){
        const UserExist = await UserModel.exists({email : user.email})
        if(UserExist){
            err = "Email Đã Tồn Tại !";
            return res.render("admin/users/edit_user", {
                data : {err}, 
                user : UserByID
            })
        }
    }
    
    await UserModel.findByIdAndUpdate(id, user);
    res.redirect('/admin/users');
}
const del = async (req, res)=>{
    const {id} = req.params;
    await UserModel.findByIdAndDelete(id);
    res.redirect('/admin/users');
}
module.exports = {
    index,
    create,
    store,
    edit,
    update,
    del
}