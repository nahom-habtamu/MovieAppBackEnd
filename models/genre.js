const Joi = require('joi');
const mongoose = require('mongoose');
const { join } = require('lodash');


const genreSchema = new mongoose.Schema({
    name: {
      type: String,
      unique : true,
      required: true,
      minlength: 5,
      maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);

const genreValidationSchema = Joi.object({
  name : Joi.string().min(3).required()
});

exports.Genre = Genre; 
exports.genreValidationSchema = genreValidationSchema;