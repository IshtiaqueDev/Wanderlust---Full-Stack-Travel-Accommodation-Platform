const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/Listing")
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./Schema.js");
const port=8080;

app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
main().then((res)=>{
    console.log("Connected with Database Successfully!");
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}



app.get("/",(req,res)=>{
    res.send("Hi Iam Root!");
})

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:7000,
//         location:"Karachi , Pakistan",
//         country:"Pakistan"
//     })
    
//     await sampleListing.save().then((res)=>{
//         console.log(res);
//     })

//     console.log("Sample Saved");
//     res.send("Working Fine.")
// })

// Index Route 
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}))

//Show Route
app.get("/listings/:id/",wrapAsync(async(req,res)=>{
    let id=req.params.id;
    let list=await Listing.findById(id);
    //console.log(list);   
    // res.send(list) 
    res.render("./listings/show.ejs",{list});
}))

app.get("/listings/new/add",(req,res)=>{
    res.render("./listings/form.ejs");
})

//CREATE Route
app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
     const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));


//Update Route
app.get("/listings/:id/edit",validateListing,wrapAsync(async(req,res)=>{
    let id=req.params.id;
    //console.log(id);
   let list= await Listing.find({_id:id});
   //console.log(list[0]);
    res.render("./listings/edit.ejs",{list});
}))

//Edited Data (Updation)
app.put("/listings/:id/edits",wrapAsync(async(req,res)=>{
    let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect("/listings");
}))




//Delete Route
app.delete("/listings/:id/delete",wrapAsync(async(req,res)=>{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
}));


app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"));
});


app.use((err,req,res,next)=>{
    let {status=500,message="Something Went Wrong!"}=err;
    res.status(status).render("error.ejs",{err});
    // res.status(status).send(message);
})


app.listen(port,()=>{
    console.log("Server is listening to port 8080");
})
