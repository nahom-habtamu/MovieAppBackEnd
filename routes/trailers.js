const express = require('express');
const { Trailer , trailerValidationSchema } = require('../models/trailer');
const { Movie } = require('../models/movie');
const mongoose = require('mongoose');

const upload = require('../multer/multerTrailerConfig');
const router = express.Router();

const { producer, user , admin } = require('../middlewares/role');
const auth = require('../middlewares/auth');


router.post('/',[ auth,producer ],upload.single('video'),async(req,res) => {
    try {
        const { error } = trailerValidationSchema.validate(req.body);
        if(error){
            throw new Error(error.message);
        }
        else {
            const movie = await Movie.findById(req.body.movieId);
            const file = req.file;
            if(movie){
                if(file){
                    if(req.error){
                        throw new Error("invalid file type");
                    }
                    else {
                        const trailer = new Trailer({
                            movieUrl : file.path,
                            movie : movie
                        });
                        const response = await trailer.save();
                        res.status(200).send(response);
                    }
                }
                else {
                    throw new Error('Invalid file');
                }
            }
            else {
                throw new Error('Movie not found');
            }
        }
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/',[auth],async(req,res) => {
    try {
        const trailers = await Trailer.find({});
        if(trailers){
            res.status(200).send(trailers);    
        }
        else {
            throw new Error('trailers not found');
        }
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/:id', [auth], async(req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){
            const trailer = await Trailer.findById(id);
            if(trailer){
                res.status(200).send(trailer);    
            }
            else {
                throw new Error('trailer not found by this id');
            }
        }
        else {
            throw new Error('Invalid Trailer Id')
        }
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete('/:id', [auth,producer], async(req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){
            const trailer = await Trailer.findByIdAndDelete(id);
            if(trailer){
                res.status(200).send(trailer);    
            }
            else {
                throw new Error('trailer not found by this id');
            }
        }
        else {
            throw new Error('Invalid Trailer Id')
        }   
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});


router.put('/:id',[auth,producer],upload.single('video'),async(req,res) => {
    try {
        const { error } = trailerValidationSchema.validate(req.body);
        if(error){
            throw new Error(error.message);
        }
        else {
            const id = req.params.id;
            if(mongoose.Types.ObjectId.isValid(id)){
                const movie = await Movie.findById(req.body.movieId);
                const file = req.file;
                if(movie){
                    if(file){
                        if(req.error){
                            throw new Error("invalid file type");
                        }
                        else {
                            const trailer = await Trailer.findByIdAndUpdate( id ,{
                                movieUrl : file.path,
                                movie : movie
                            }, { new : true});
                            res.status(200).send(trailer);
                        }
                    }
                    else {
                        throw new Error('Invalid file');
                    }
                }
                else {
                    throw new Error('Movie not found');
                }
            }
            else {
                throw new Error('Invalid Trailer id')
            }
            
        }
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});
module.exports = router;