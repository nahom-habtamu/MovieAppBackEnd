const express = require('express');
const mongoose = require('mongoose');
const { Genre , genreValidationSchema } = require('../models/genre');


const auth = require('../middlewares/auth');
const {admin} = require('../middlewares/role');

const router = express.Router();

router.get('/', [auth], async (req,res) => {
    try {
        const genres = await Genre.find({}).select({ _id: 1, name: 1 , _v : -1});
        if(genres){
            res.status(200).send(genres);
        }
        else {
            throw new Error("Genres Not Found");
        }
    } 
    catch (error) {
       res.status(404).send(error.message); 
    }
});

router.get('/:id', [auth], async(req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){
            const genre = await Genre.findById(id);
            if(genre){
                res.status(200).send(genre);
            }
            else {
                throw new Error("Genre with that ID not found");
            }
        }
        else {
            throw new Error("Invalid ObjectID");
        }
    } 
    catch (error) {
        res.status(500).send(error.message);    
    }
});

router.post('/', [auth,admin], async(req,res) => {
    try {
        const { error } = genreValidationSchema.validate(req.body);
        if(error){
            throw new Error(error.message);
        }
        else {
            try {
                const duplicate = await Genre.find({ name : req.body.name });
                if(duplicate.length === 0){ 
                    const genre = new Genre({
                        name : req.body.name
                    });
                    const response = await genre.save();
                    res.status(200).send(response);
                }
                else {
                    throw new Error('Duplicate Genre');
                }
            } catch (error) {
                res.status(400).send(error.message);
            }
        }
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete('/:id',[auth,admin],async(req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){
            const genreDeleted = await Genre.findByIdAndDelete(id);
            if(genreDeleted){
                res.status(200).send(genreDeleted);
            }
            else {
                throw new Error('Genre with that ID not found');
            }
        }
        else {
            throw new Error('Invalid GenreID')
        }
    } 
    catch (error) {
        res.status(400).send(error.message)
    }
});

module.exports = router;