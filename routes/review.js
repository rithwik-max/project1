const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const wrapAsync= require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware.js");
const { validateReview } = require("../middleware.js");
const { isReviewAuthor }= require("../middleware.js");
const reviewController = require("../controllers/review.js");
//reviews
router.post("/",
    validateReview,
    isLoggedIn,
    wrapAsync(reviewController.post));
//delete review
router.delete("/:reviewId",
    isReviewAuthor,
     wrapAsync(reviewController.delete));
module.exports = router;