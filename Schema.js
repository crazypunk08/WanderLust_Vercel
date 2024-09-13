const Joi = require('joi');
//This is for server side validation of the form constraints and its rules
//in case request are made through postman

module.exports.ListingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),

    }).required(),
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required(),
});