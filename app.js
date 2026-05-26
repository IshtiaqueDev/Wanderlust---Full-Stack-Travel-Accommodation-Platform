const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/Listing")
const port=8080;

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

app.get("/testListing",async(req,res)=>{
    let sampleListing=new Listing({
        title:"My New Villa",
        description:"By the beach",
        price:7000,
        location:"Karachi , Pakistan",
        country:"Pakistan"
    })
    
    await sampleListing.save().then((res)=>{
        console.log(res);
    })

    console.log("Sample Saved");
    res.send("Working Fine.")
})