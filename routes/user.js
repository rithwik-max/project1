const express = require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
//signup
router.get("/signup",(req,res) => {
    res.render ("users/signup.ejs");
});
//signup
router.post("/signup",wrapAsync(async(req,res) => {
    try{
            let { username , email , password }= req.body;
            const newUser = new User({email,username});
            const registerUser = await User.register(newUser,password);
//auto sign-in to login
            req.login(registerUser,(err) => {
                if(err){
                    next(err);
                }
                req.flash("success","Welcome to WundeLust");
                res.redirect("/listings");
            });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

//login
router.get("/login",(req,res) => {
    res.render("users/login.ejs");
});
//login
router.post("/login",
    passport.authenticate("local",{
        failureRedirect:"/login",   
        failureFlash:true,
    }),
    async(req,res) =>{
        req.flash("success","Welcome  back to WanderLust ");
        res.redirect("/listings");
    },
);

//logout
router.get("/logout",(req,res,next) => {
    req.logOut((err) => {
        if(err){
            next(err);
        }
        req.flash("success","you Logged out!");
        res.redirect("/listings");
    });
});


module.exports = router;

