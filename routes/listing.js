const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../Schema.js")
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/Listing")
const listings=require("../routes/listing.js")
const router=express.Router();


const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


// Index Route 
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}))

//Show Route
router.get("/:id/",wrapAsync(async(req,res)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id).populate("reviews");
    //console.log(list);   
    // res.send(list) 
    res.render("./listings/show.ejs",{listing});
}))

router.get("/new/add",(req,res)=>{
    res.render("./listings/form.ejs");
})

//CREATE Route
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
     const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));


//Update Route
router.get("/:id/edit",validateListing,wrapAsync(async(req,res)=>{
    let id=req.params.id;
    //console.log(id);
   let list= await Listing.find({_id:id});
   //console.log(list[0]);
    res.render("./listings/edit.ejs",{list});
}))

//Edited Data (Updation)
router.put("/:id/edits",wrapAsync(async(req,res)=>{
    let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect("/listings");
}))




//Delete Route
router.delete("/:id/delete",wrapAsync(async(req,res)=>{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
}));


    module.exports=router;