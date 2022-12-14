const mongoose = require('mongoose');

// const db_connect = process.env.mongodb;
// // local
const db_connect = "mongodb://localhost/vp_shop_project";
module.exports = () => {
    mongoose.connect(db_connect, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then(rs => console.log(`Connected`))
        .catch(err => console.log(`ERR : ${err}`));
    return mongoose;
}