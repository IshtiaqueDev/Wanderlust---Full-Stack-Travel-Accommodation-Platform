const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/Listing")
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
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

app.listen(port,()=>{
    console.log("Server is listening to port 8080");
})

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
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
})

//Show Route
app.get("/listings/:id/",async(req,res)=>{
    let id=req.params.id;
    let list=await Listing.findById(id);
    //console.log(list);   
    // res.send(list) 
    res.render("./listings/show.ejs",{list});
})

app.get("/listings/new/add",(req,res)=>{
    res.render("./listings/form.ejs");
})

//Post Route
app.post("/listings",async(req,res,next)=>{
   try{
     const newListing=new Listing(req.body.listing);
    await newListing.save().then((res)=>{
        console.log(res);
    });
    res.redirect("/listings");
   }catch(err){
    next(err);
   }
})


//Update Route
app.get("/listings/:id/edit",async(req,res)=>{
    let id=req.params.id;
    //console.log(id);
   let list= await Listing.find({_id:id});
   //console.log(list[0]);
    res.render("./listings/edit.ejs",{list});
})

//Edited Data (Updation)
app.put("/listings/:id/edits",async(req,res)=>{
    let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect("/listings");
})


app.use((err,req,res,next)=>{
    res.send("Something Went Wrong !");
})

//Delete Route
app.delete("/listings/:id/delete",async(req,res)=>{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
});