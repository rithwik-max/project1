const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const wrapAsync= require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
//validate-review
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        return next(new ExpressError(400, error.details.map(el => el.message).join(",")));
    } else {
        next();
    }
}
//reviews
router.post("/",
    validateReview,
    wrapAsync(async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); 
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
   res.redirect(`/listings/${listing._id}`);
}));
//delete review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));
module.exports = router;