const express = require("express");
const router = express.Router();


router.get("/signup",(req,res) => {
    res.render ("users/signup.ejs");
});
// router.get("/signup",(req,res) => {
//     res.render("users/singup.ejs");
// });




module.exports = router;

