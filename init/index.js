const mongoose=require("mongoose");
const AllData=require("../init/data");
const Listing=require("../models/Listing");

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);


main().then(()=>{
    console.log("Connnection Formed Successfully!");
}).catch((err)=>{
    console.log(err);
})


async function main() {
    await mongoose.connect("mongodb+srv://ishtiaquealiai12_db_user:oMjPi6kR0zr8QiK6@cluster0.rxdkbki.mongodb.net");
}


const initDB=async()=>{
    await Listing.deleteMany({ owner: "6a5dd3982790b5bd7b41723a"});
    AllData.data=AllData.data.map((obj)=>({...obj,owner:"6a5dd3982790b5bd7b41723a"}));
   await  Listing.insertMany(AllData.data);
}

initDB();
