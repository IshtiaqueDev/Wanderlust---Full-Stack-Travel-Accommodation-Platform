const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../Schema.js")
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/Listing")
const listings=require("../routes/listing.js")
const {isLoggedIn, saveRedirectedUrl,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const router=express.Router();
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});


//Index Route
router.route("/")
    .get(
    wrapAsync(
        listingController.index
    ))
    .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing));


//Show Route
router.get("/:id",
    wrapAsync(
        listingController.showListing
    ));

//New Add
router.get("/new/add",
    isLoggedIn,
    listingController.formRendering
)


//Update Route
router.get("/:id/edit",
    isLoggedIn,isOwner,
    validateListing,
    wrapAsync(listingController.updateListing));


//Edited Data (Updation)
router.put("/:id/edits",
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.editedData));


//Delete Route
router.delete("/:id/delete",
    isLoggedIn,
    isOwner
    ,wrapAsync(listingController.destroyListing));


    module.exports=router;