const User = require("../models/user.js");

const Listing = require("../models/listing"); // ← ADD THIS

//signup-form
module.exports.signupForm = (req,res) => {
    res.render ("users/signup.ejs");
};

//signup-post
module.exports.signupPost = async(req,res) => {
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
};

//login-form
module.exports.loginForm = (req,res) => {
    res.render("users/login.ejs");
};

//login-post
module.exports.loginPost = async(req,res) =>{
        req.flash("success","Welcome  back to WanderLust ");
        res.redirect(res.locals.redirectUrl || "/listings");
};

//logout
module.exports.logout = (req,res,next) => {
    req.logOut((err) => {
        if(err){
            next(err);
        }
        req.flash("success","you Logged out!");
        res.redirect("/listings");
    });
};

// show profile
module.exports.profile = async (req, res) => {
    const user = await User.findById(req.user._id);
    const myListings = await Listing.find({ owner: req.user._id });
    res.render("users/profile.ejs", { user, myListings });
};

// edit profile form
module.exports.editProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.render("users/editProfile.ejs", { user });
};

// update profile
module.exports.updateProfile = async (req, res) => {
    const { bio, phone } = req.body;
    const user = await User.findById(req.user._id);

    user.bio = bio;
    user.phone = phone;

    // if new profile image uploaded
    if (req.file) {
        user.profileImage = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await user.save();
    req.flash("success", "Profile updated!");
    res.redirect("/profile");
};