const express = require('express');
const mongoose = require('mongoose');
const { Admin, adminValidationSchema } = require('../models/admin');
const { User } = require('../models/user');

const auth = require('../middlewares/auth');
const { admin} = require('../middlewares/role');

const router = express.Router();

router.get('/',[auth,admin],async(req,res) => {
    try {
        const admins = await Admin.find({});
        if(admins){
            res.status(200).send(admins);
        }
        else {
            throw new Error('Admins not found in database');
        }
    } 
    catch (error) {
        res.status(400).send(error.message);    
    }
});

router.get('/:id',[auth,admin],async (req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){
            const admin = await Admin.findById(id);
            if(admin){
                res.status(200).send(admin);
            }    
            else {
                throw new Error("Admin with that ID not found");
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

router.post('/', async(req,res) => {

    try {
        
        const { error } = adminValidationSchema.validate(req.body);
        if(error){
            throw new Error(error.message);
        }
        else {
            const duplicate = await Admin.find({ phoneNumber : req.body.phoneNumber});
            if(duplicate.length === 0){   
                const admin = new Admin({
                    fullName : req.body.fullName,
                    phoneNumber : req.body.phoneNumber,
                });
                const response = await admin.save();
                res.status(200).send(response);
            }
            else {
                throw new Error('Admin Already Registered')
            }
        }
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete('/me',[auth,admin],async(req,res) => {
    try {
        const id = req.user.cpaID;
        if(mongoose.Types.ObjectId.isValid(id)){
            const response = await Admin.findByIdAndDelete(id);
            if(response){
                res.status(200).send(response);
            }
            else {
                throw new Error('Admin with that ID not found');
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

router.put('/:id',[auth,admin],async(req,res) => {
    try {
        const { error } = adminValidationSchema.validate(req.body);
        if(error){
            throw new Error(error.message);
        }
        else {
            const id = req.params.id;
            if(mongoose.Types.ObjectId.isValid(id) === true){
                const editedAdmin = await Admin.findByIdAndUpdate(id,{
                    fullName : req.body.fullName,
                    phoneNumber : req.body.phoneNumber,
                }, { new : true});
                if(editedAdmin){
                    const user = await User.find({ customerOrProducerId : id}).select("_id");
                    if(user.length !== 0){
                        const userId = user[0]._id;
                        const editedUser = await User.findByIdAndUpdate(userId,{
                            phoneNumber : req.body.phoneNumber 
                        },{new : true});
                        console.log(editedUser);
                    }
                    res.status(200).send(editedAdmin);
                }
                else {
                    throw new Error('Admin with that Id not found');
                }
                
            }
            else {
                throw new Error('Invalid AdminID');
            }
        }
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;