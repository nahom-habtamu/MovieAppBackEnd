const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const movieSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [ true , "Movie Needs A Title"],
        maxlength : 50,
        minlength : 1
    },
    genre : {
        type : new mongoose.Schema({
            name : {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 25
            }
        }),

        required : [true , "Enter Genre For The Movie"]
    },

    description : {
        type : String,
        minlength : 10,
        maxlength : 255,
        required : [ true , "Please Enter Description for the Movie"]
    },

    producer : {
        type : new mongoose.Schema({
            name : {
                type : String,
                required : [ true,"Enter Producers Name"]
            },
            rating : {
                type : Number,
                required : [ true, "Please Enter The Rating Of The Producer"],
                maxlength : 5,
                minlength : 1,
                default : 1
            },
        })
    },

    dateReleased : {
        type : String,
        required : [true, 'Enter date of release'],
        validate : {
            validator : (date) => {
                const regexDate = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
                return regexDate.test(date);
            },
            message : "date not formatted correctly"
        }
    },

    price : {
        type : Number,
        required : [ true , "Enter Price For Your Movie"],
        maxlength : 25,
        minlength : 10
    },

    rating : {
        type : Number,
        required : [ true , "Enter Rating for the Movie"],
        minlength : 2,
        maxlength : 5
    },
    movieUrl : {
        type : String,
        required : true
    }
});

const Movie = mongoose.model('Movie',movieSchema);

let movieValidationSchema = Joi.object({
    title : Joi.string().required().min(1).max(25),
    genreId : Joi.objectId(),
    description : Joi.string().required().min(10).max(255),
    dateReleased : Joi.string().required().min(8).max(12),
    producerId : Joi.objectId(),
    price : Joi.number().min(10).max(25),
    rating : Joi.number().min(2).max(5)
});

module.exports.movieValidationSchema = movieValidationSchema;
module.exports.Movie = Movie;
