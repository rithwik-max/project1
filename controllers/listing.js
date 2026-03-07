const Listing = require("../models/listing");

//index
module.exports.index =async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
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
};

//create
module.exports.create = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image= {url , filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
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
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     req.flash("update"," Listing Updated!");
    res.redirect("/listings");
};

//delete
module.exports.delete = async (req, res) => {
    let { id } = req.params;
     req.flash("error"," Listing Deleted!");
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
};