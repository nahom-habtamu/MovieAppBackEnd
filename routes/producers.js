const express = require('express');
const mongoose = require('mongoose');
const { Producer, producerValidationSchema } = require('../models/producer');
const { User } = require('../models/user');

const { producer,adminOrproducer} = require('../middlewares/role');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', [auth] ,async(req,res) => {
    try {
        const producers = await Producer.find({});
        if(producers){
            res.status(200).send(producers);
        }
        else {
            throw new Error('Producers not found in database');
        }
    } 
    catch (error) {
        res.status(400).send(error.message);    
    }
});

router.get('/:id',[auth],async (req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){
            const producer = await Producer.findById(id);
            if(producer){
                res.status(200).send(producer);
            }    
            else {
                throw new Error("Producer with that ID not found");
            }
        }
        else {
            throw new Error("Invalid ID");
        }
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});


router.post('/',  async (req,res) => {
    try {
        const { error } = producerValidationSchema.validate(req.body);
        if(error){
            throw new Error(error.message);
        }
        else {
            const duplicate = await Producer.find({ name : req.body.name});
            if(duplicate.length === 0){
                const producer = new Producer({
                    name : req.body.name,
                    phoneNumber : req.body.phoneNumber,
                    rating : req.body.rating
                });
                const response = await producer.save();
                res.status(200).send(response);
            }
            else {
                throw new Error('Producer Duplicate');
            }
        }
    } 
    catch (error) {
        res.status(400).send(error.message);    
    }
});

router.delete('/:id',[auth,adminOrproducer],async(req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){
            const response = await Producer.findByIdAndDelete(id);
            if(response){
                res.status(200).send(response);
            }
            else {
                throw new Error('Producer with that ID not found');
            }
        }
        else {
            throw new Error('Invalid Id');
        }    
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.put('/:id',[auth,producer],async(req,res) => {
    try {
        const { error } = producerValidationSchema.validate(req.body);
        if(error){
            throw new Error(error.message);
        }
        else {
            const id = req.params.id;
            if(mongoose.Types.ObjectId.isValid(id) === true){
                const editedProducer = await Producer.findByIdAndUpdate(id,{
                    name : req.body.name,
                    phoneNumber : req.body.phoneNumber,
                    rating : req.body.rating,
                }, { new : true});
                if(editedProducer){
                    const user = await User.find({ customerOrProducerId : id}).select("_id");
                    if(user.length !== 0){
                        const userId = user[0]._id;
                        await User.findByIdAndUpdate(userId,{
                            phoneNumber : req.body.phoneNumber 
                        },{new : true});
                    }
                    res.status(200).send(editedProducer);
                }
                else {
                    throw new Error('Producer with that Id not found');
                    }
            }
            else {
                throw new Error('Invalid ProducerID');
            }
        }
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;