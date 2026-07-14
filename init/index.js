const mongoose=require("mongoose");
const AllData=require("../init/data");
const Listing=require("../models/Listing");

main().then(()=>{
    console.log("Connnection Formed Successfully!");
}).catch((err)=>{
    console.log(err);
})


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}


const initDB=async()=>{
    await Listing.deleteMany({});
    AllData.data=AllData.data.map((obj)=>({...obj,owner:"6a4dbfdd38bdb6b6d3fe25a8"}));
   await  Listing.insertMany(AllData.data);
}

initDB();
