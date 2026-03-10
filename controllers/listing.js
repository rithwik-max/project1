const Listing = require("../models/listing");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//index
module.exports.index = async (req, res) => {
    const { q } = req.query;
    
    let allListings;
    if (q) {
        allListings = await Listing.find({
            $or: [
                { title: { $regex: q, $options: "i" } },
                { location: { $regex: q, $options: "i" } },
                { country: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } }
            ]
        });
    } else {
        allListings = await Listing.find({});
    }
    
    res.render("listings/index.ejs", { allListings, searchQuery: q || "" });
};

//new
module.exports.new = async (req, res) => {
    res.render("listings/new.ejs");
};

//show
module.exports.show = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner"); 
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings"); 
    }
    res.render("listings/show.ejs", { listing });
};

//create
module.exports.create = async (req, res, next) => {
    // let response = await geocodingClient
    //     .forwardGeocode({
    //         query: req.body.listing.location,
    //         limit: 2
    //     })
    //     .send();
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    // newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

//edit
module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
};

//update
module.exports.update = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("update", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

//delete
module.exports.delete = async (req, res) => {
    let { id } = req.params;
    req.flash("error", "Listing Deleted!");
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
};