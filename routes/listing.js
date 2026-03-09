const express = require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError= require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const { isLoggedIn  } = require("../middleware.js");
const { isOwner  } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });



router
    .route("/")
    //index
    .get( wrapAsync(listingController.index))
    //create
    .post(validateListing,upload.single("listing[image]"),wrapAsync(listingController.create));

    // Inside routes/listing.js (or wherever your main GET route is)
router.get("/", async (req, res) => {
    // 1. Grab the search term from the URL
    const searchQuery = req.query.q; 
    let allListings;

    if (searchQuery) {
        // 2. If there is a search term, filter the database.
        // This uses MongoDB regex for a case-insensitive partial match on the 'title' field.
        allListings = await Listing.find({ 
            title: { $regex: searchQuery, $options: "i" } 
        });
        
        // Note: If you want to search by location instead, change 'title' to 'location' or your equivalent schema key.
    } else {
        // 3. If no search term, return everything as usual
        allListings = await Listing.find({});
    }

    // 4. Render the page with the filtered or full list
    res.render("listings/index.ejs", { allListings });
});
// new
router.get("/new", 
     isLoggedIn  , 
     (listingController.new));

router
    .route("/:id")
    //show
    .get(wrapAsync(listingController.show))
    //update
    .put(
    validateListing,
     isLoggedIn ,
     upload.single("listing[image]"),
     isOwner,
     wrapAsync(listingController.update))
     // Delete 
    .delete( 
    isLoggedIn ,
    isOwner ,
     wrapAsync(listingController.delete));

// edit
router.get("/:id/edit", 
    isLoggedIn ,
    isOwner,
    wrapAsync(listingController.edit));
module.exports = router;