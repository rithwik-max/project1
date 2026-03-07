const Listing = require("./models/listing.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError= require("./utils/ExpressError.js");
const wrapAsync= require("./utils/wrapAsync.js");
const Review = require("./models/review.js");
//signup to login
module.exports.isLoggedIn = (req, res , next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Login to create listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; 
    }
    next();
};
//to check owner or  not
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
//checkin author or not
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You did not create this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
//validate-listing
module.exports.validateListing = (req,res,next) =>{
     let { error } = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

//validate-review
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        return next(new ExpressError(400, error.details.map(el => el.message).join(",")));
    } else {
        next();
    }
}