const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const trailerSchema = new mongoose.Schema({
    movieUrl : {
        type : String,
        required : [true]
    },

    movie : {
        type : new mongoose.Schema({
            title : {
                type : String,
                required : true
            }
        })
    }

});

const Trailer = mongoose.model('Trailer', trailerSchema);

const trailerValidationSchema = Joi.object({
    movieId : Joi.objectId().required(),
});

module.exports.Trailer = Trailer;
module.exports.trailerValidationSchema = trailerValidationSchema;