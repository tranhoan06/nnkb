const config = require('config');
const multer = require('multer');

const upload = multer({
    dest: config.get('app').temp
})
module.exports = {
    upload
}