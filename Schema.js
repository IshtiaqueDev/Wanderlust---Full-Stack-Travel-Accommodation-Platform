const joi=require("joi");

const listingSchema=joi.object({
    listing: joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required(),
        country:joi.string().required(),
        price:joi.number().required().min(0),
        img:joi.string().allow("",null) 
    }).required()
})

    module.exports=listingSchema;