const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const wrapAsync= require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware.js");
const { validateReview } = require("../middleware.js");
const { isReviewAuthor }= require("../middleware.js");
//reviews
router.post("/",
    validateReview,
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); 
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Added!");
   res.redirect(`/listings/${listing._id}`);
}));
//delete review
router.delete("/:reviewId",
    isReviewAuthor,
     wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
     req.flash("error"," Review Deleted!");
    res.redirect(`/listings/${id}`);
}));
module.exports = router;