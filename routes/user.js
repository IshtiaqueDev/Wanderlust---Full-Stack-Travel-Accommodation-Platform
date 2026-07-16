const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const router=express.Router();
const passport=require("passport");
const User=require("../models/user.js");
const { saveRedirectedUrl } = require("../middleware.js");
const userController=require("../controllers/user.js");

router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs");
});

router.post("/signup",wrapAsync(userController.signupRoute));

router.get("/login",userController.loginGet);

router.post("/login",saveRedirectedUrl,
    passport.authenticate(
        "local",{
            failureRedirect:"/login",
            failureFlash:true
        }),
        userController.loginPost
    )


router.get("/logout",userController.logout);

module.exports=router;