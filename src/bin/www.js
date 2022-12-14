
const app = require("../apps/app")

const config = require("config");

const server = app.listen(port = process.env.PORT, () =>{
    console.log(`server is running ${port}`);
})

require('../apps/chat')(server);