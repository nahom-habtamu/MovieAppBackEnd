const express = require('express');
const mongoose = require('mongoose');

const { Movie, movieValidationSchema } = require('../models/movie');
const { Genre } = require('../models/genre');
const { Producer } = require('../models/producer');

const router = express.Router();
const upload = require('../multer/multerMovieConfig');

const auth = require('../middlewares/auth');
const { producer, user , admin, adminOrproducer, adminOrUser } = require('../middlewares/role');

router.get('/', [auth], async(req,res) => {
    try {
        const movies = await Movie.find({});
        if(movies){
            res.status(200).send(movies);
        }   
        else {
            throw new Error('Movies not found');
        } 
    } 
    catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/:id',[auth],async(req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id) === true){
            const movie = await Movie.findById(id);
            if(movie){
                res.status(200).send(movie)
            }
            else {
                throw new Error("Movie with that ID not found");
            }
        }
        else {
            throw new Error("Invalid ID");
        }
    } 
    catch (error) {
        res.send(error.message);
    }
});

router.delete('/:id',[auth,admin],async(req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){
            const deletedMovie = await Movie.findByIdAndDelete(id);
            if(deletedMovie){
                res.status(200).send(deletedMovie);
            }
            else {
                throw new Error('Movie not found');
            }
        }
        else {
            throw new Error('Invalid movie ID');
        }
    } 
    catch (error) {
        res.status(400).send(error.message);    
    }
});

router.post('/' ,[auth,adminOrproducer],upload.single('video'),async(req,res) => {
    try {
        const { error } = movieValidationSchema.validate(req.body);
        if(error){
            throw new Error(error.message);
        }
        else {
            if(req.file){
                const producer = await Producer.findById(req.body.producerId).select({name : 1, rating : 1})
                const genre = await Genre.findById(req.body.genreId).select({ name : 1});
                
                if(genre && producer){
                    const movie = new Movie({
                        title : req.body.title,
                        genre,
                        producer,
                        description : req.body.description,
                        dateReleased : req.body.dateReleased,
                        price : req.body.rating * 10,
                        rating : req.body.rating,
                        movieUrl : req.file.path
                    });
                    const response = await movie.save();
                    res.status(200).send(response);
                }
                else {
                    throw new Error('Genre or Producer not found')
                }
            }
            else {
                throw new Error('Invalid file Type')
            }
        }
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.put('/:id',[auth,admin],upload.single('video'),async(req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){

            const { error } = movieValidationSchema.validate(req.body);
            if(error){
                throw new Error(error.message);
            }
            else {
                const producer = await Producer.findById(req.body.producerId).select({name : 1, rating : 1})
                const genre = await Genre.findById(req.body.genreId).select({ name : 1});

                if(genre && producer){
                    if(req.file){
                        const updatedMovie = await Movie.findByIdAndUpdate(id,{
                            title : req.body.title,
                            genre,
                            producer,
                            description : req.body.description,
                            dateReleased : req.body.dateReleased,
                            price : req.body.rating * 10,
                            rating : req.body.rating,
                            movieUrl : req.file.path
                        }, { new : true});
                        if(updatedMovie){
                            res.status(200).send(updatedMovie);
                        }
                        else {
                           throw new Error('Movie with this id not found'); 
                        }
                    }
                    else {
                        throw new Error('Invalid File')
                    }
                }
                else {
                    throw new Error('Invalid Producer or Genre');
                }
            }
        }
        else {
            throw new Error("Invalid Movie Id");
        }
    } 
    catch (error) {
        res.status(400).send(error.message);    
    }
});
module.exports = router;