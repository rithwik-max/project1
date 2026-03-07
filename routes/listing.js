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