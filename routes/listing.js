const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../Schema.js")
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/Listing")
const listings=require("../routes/listing.js")
const {isLoggedIn, saveRedirectedUrl,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const router=express.Router();



// Index Route 
router.get("/",
    wrapAsync(
        listingController.index
    ));

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

//CREATE Route
router.post("/",
    validateListing,
    isLoggedIn,
    wrapAsync(listingController.createListing));


//Update Route
router.get("/:id/edit",
    isLoggedIn,isOwner,
    validateListing,
    wrapAsync(listingController.updateListing));


//Edited Data (Updation)
router.put("/:id/edits",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editedData));


//Delete Route
router.delete("/:id/delete",
    isLoggedIn,
    isOwner
    ,wrapAsync(listingController.destroyListing));


    module.exports=router;