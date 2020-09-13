const express = require('express');
const mongoose = require('mongoose');
const { Customer, customerValidationSchema } = require('../models/customer');
const { User } = require('../models/user');

const auth = require('../middlewares/auth');
const { producer, user , admin, adminOrproducer, adminOrUser } = require('../middlewares/role');

const router = express.Router();

router.get('/',[auth,admin], async(req,res) => {
    try {
        const customers = await Customer.find({});
        if(customers){
            res.status(200).send(customers);
        }
        else {
            throw new Error('Customers not found in database');
        }
    } 
    catch (error) {
        res.status(400).send(error.message);    
    }
});

router.get('/:id',[auth,adminOrUser],async (req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){
            const customer = await Customer.findById(id);
            if(customer){
                res.status(200).send(customer);
            }    
            else {
                throw new Error("Customer with that ID not found");
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

router.post('/',async(req,res) => {

    try {
        
        const { error } = customerValidationSchema.validate(req.body);
        if(error){
            throw new Error(error.message);
        }
        else {
            const duplicate = await Customer.find({ phoneNumber : req.body.phoneNumber});
            if(duplicate.length === 0){   
                const customer = new Customer({
                    fullName : req.body.fullName,
                    phoneNumber : req.body.phoneNumber,
                    location : req.body.location
                });
                const response = await customer.save();
                res.status(200).send(response);
            }
            else {
                throw new Error('Customer Already Registered')
            }
        }
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete('/:id',[auth,adminOrUser],async(req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){
            const response = await Customer.findByIdAndDelete(id);
            if(response){
                res.status(200).send(response);
            }
            else {
                throw new Error('Customer with that ID not found');
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

router.put('/:id',[auth,user],async(req,res) => {
    try {
        const { error } = customerValidationSchema.validate(req.body);
        if(error){
            throw new Error(error.message);
        }
        else {
            const id = req.params.id;
            if(mongoose.Types.ObjectId.isValid(id) === true){
                const editedCustomer = await Customer.findByIdAndUpdate(id,{
                    fullName : req.body.fullName,
                    phoneNumber : req.body.phoneNumber,
                    location : req.body.location
                }, { new : true});
                if(editedCustomer){
                    const user = await User.find({ customerOrProducerId : id}).select("_id");
                    if(user.length !== 0){
                        const userId = user[0]._id;
                        const editedUser = await User.findByIdAndUpdate(userId,{
                            phoneNumber : req.body.phoneNumber 
                        },{new : true});
                        console.log(editedUser);
                    }
                    res.status(200).send(editedCustomer);
                }
                else {
                    throw new Error('Customer with that Id not found');
                }
                
            }
            else {
                throw new Error('Invalid CustomerID');
            }
        }
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;