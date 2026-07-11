const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const router=express.Router();
const passport=require("passport");
const User=require("../models/user.js");
const { saveRedirectedUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
    let user=req.body;
    //console.log(user);
    const newUser=new User(user);;
    const registeredUser=await User.register(newUser,user.password);
    //console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
          return  next(err);
        }
        req.flash("success","Welcome to Wanderlust!");
        return res.redirect("/listings");
    });   
    }catch(err){
        req.flash("error",err.message);
        return res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("./users/login.ejs");
})

router.post("/login",saveRedirectedUrl,
    passport.authenticate(
        "local",{
            failureRedirect:"/login",
            failureFlash:true
        }),async(req,res)=>{
    req.flash("success","Welcome to Wanderlust !");
    if(!res.locals.redirectedUrl){
    res.redirect(res.locals.redirectedUrl);
    }else{
    res.redirect("/listings");
}})


router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logout Successfully!");
        res.redirect("/listings");
    });
});

module.exports=router;