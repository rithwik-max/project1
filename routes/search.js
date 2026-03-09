const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const listingController = require("../controllers/listing");

router.get("/", wrapAsync(async (req, res) => {
    const { q } = req.query;
    
    const listings = await Listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } }
        ]
    });
    
    res.render("listings/index", { listings, searchQuery: q });
}));

module.exports = router;