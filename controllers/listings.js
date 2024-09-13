const Listing = require("../models/listing.js");

module.exports.search=async (req,res)=>{
    try {
        const { search } = req.query;  // Get the title query parameter from the URL
        const allListings = await Listing.find({
            title: { $regex: search, $options: "i" }  // "i" option makes it case-insensitive
        });  // Convert the cursor to an array to send as a response
        res.render("listings/index.ejs", { allListings});

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    };
};

module.exports.index=async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    res.render("listings/show.ejs", { listings });
};

module.exports.renderNewform=(req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListings=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.createListings=async (req, res, next) => {
   const url=req.file.path;
   const filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;//whenever a owner creates a listing he 
    //becomes the owner basically req.body contains all the information about the user
    newListing.image={url,filename};
    await newListing.save();
     req.flash("success","New Listing created");
    res.redirect("/listings");
};

module.exports.editListings=async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id);
    res.render("listings/edit.ejs", { listings });
};

module.exports.updateListings=async (req, res) => {
    let { id } = req.params;
    let newListing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!="undefined"){
        const url=req.file.path;
        const filename=req.file.filename;
        newListing.image={url,filename};
        newListing.save();
    }
    req.flash("success","Listing updated");
    res.redirect("/listings");
};

module.exports.deleteListings=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!!");
    res.redirect("/listings");
};