const express = require("express");
const router = express.Router();
const path = require("path");

router.use("/", (request, response)=>{
    response.sendFile(path.join(__dirname,"../public", "index.html"))
})

module.exports = router;