const express = require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");
router
    .route("/signup")
    //signup
    .get(userController.signupForm)
    //signup-post
    .post(
        wrapAsync(userController.signupPost));

router
    .route("/login")
    //login-form
    .get(userController.loginForm)
    //login-post
    .post(
        saveRedirectUrl,
        passport.authenticate("local",{ 
            failureRedirect:"/login",   
            failureFlash:true,
        }),
        userController.loginPost,
    );

//logout
router.get("/logout",userController.logout);


module.exports = router;

