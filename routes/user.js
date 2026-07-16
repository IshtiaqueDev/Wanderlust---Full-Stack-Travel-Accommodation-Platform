const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const router=express.Router();
const passport=require("passport");
const User=require("../models/user.js");
const { saveRedirectedUrl } = require("../middleware.js");
const userController=require("../controllers/user.js");


router.route("/signup")
.get(userController.signupPageRender)
.post(wrapAsync(userController.signupRoute));



router.route("/login")
.get(userController.loginGet)
.post(saveRedirectedUrl,
    passport.authenticate(
        "local",{
            failureRedirect:"/login",
            failureFlash:true
        }),
        userController.loginPost
    )



router.get("/logout",userController.logout);

module.exports=router;