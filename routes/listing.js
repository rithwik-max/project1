const express = require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError= require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const { isLoggedIn  } = require("../middleware.js");
const { isOwner  } = require("../middleware.js");
const { validateListing } = require("../middleware.js");

router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));
// new
router.get("/new", 
     isLoggedIn  , 
     isOwner ,
     async (req, res) => {
    res.render("listings/new.ejs");
});
// show 
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate : {
            path  : "author",
        },
    })
    .populate("owner"); 
    if(!listing){
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings"); 
    };
    res.render("listings/show.ejs", { listing });
}));
// create
router.post("/", 
    validateListing,
    wrapAsync(async (req, res, next) => {
    const newListing=new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));

// edit
router.get("/:id/edit", 
    isLoggedIn ,
    isOwner,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));
// Update 
router.put("/:id",
    validateListing,
     isLoggedIn ,
     isOwner,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     req.flash("update"," Listing Updated!");
    res.redirect("/listings");
}));
// Delete 
router.delete("/:id", 
    isLoggedIn ,
    isOwner ,
     wrapAsync(async (req, res) => {
    let { id } = req.params;
     req.flash("error"," Listing Deleted!");
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));
module.exports = router;