const MD5 = require('md5.js')
module.exports = {
    app: {
        view_engine: "ejs",
        view_folder: __dirname + "/../src/apps/views",
        static_folder: __dirname + "/../src/public",
        session_key: new MD5().update('llong').digest('hex'),
        session_secure: false,
        temp: __dirname + "/../temp"
    },
    mail: {
        host: "smtp.gmail.com",
        post: 587,
        secure: false,
        auth: {
            user: "ocsen910@gmail.com",
            pass: "tnuitoietlggijje",
        }
    }
}