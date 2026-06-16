const joi=require("joi");

const listingSchema=joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required(),
        country:joi.string().required(),
        price:joi.number().required().min(0),
        img:joi.string().allow("",null) 
})

    module.exports={listingSchema};


module.exports.reviewSchema=joi.object({
        review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required(),
        }).required()
})