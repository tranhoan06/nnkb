const UserModel = require("../models/user");
const MD5 = require('md5.js')
const login = (req, res)=>{
    res.render("admin/login", {data : {}});
}
const postLogin = async (req, res)=>{
    const mail = req.body.mail;
    const pass = req.body.pass;
    const { redirect } = req.query;
    let err ;
    const user = await UserModel.find({email : mail, password : pass});
    if(mail == "" || pass == ""){
        err = `Không được bỏ trống thông tin!`
    } else if(user.length > 0){
        req.session.mail = "mail";
        req.session.pass = new MD5().update(pass).digest('hex');
        req.session.role = user[0].role;
        req.session.userID = user[0]._id || null;
        return res.redirect(redirect ? redirect : '/admin');
    }else {
        err = `Tài khoản hoặc mật khẩu không đúng!`
    }

    res.render('admin/login', {data : {err : err}});
}


module.exports = {
    login, 
    postLogin,
}