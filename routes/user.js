const express = require("express");
const multer = require("multer");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/user.js");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
    .route("/signup")
    .get(userController.signupForm)
    .post(wrapAsync(userController.signupPost));

router
    .route("/login")
    .get(userController.loginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.loginPost,
    );

// logout
router.get("/logout", userController.logout);

// profile
router.get("/profile", isLoggedIn, wrapAsync(userController.profile));

// edit profile
router.get("/profile/edit", isLoggedIn, wrapAsync(userController.editProfile));

// update profile
router.put("/profile", isLoggedIn, upload.single("profileImage"), wrapAsync(userController.updateProfile));

module.exports = router;