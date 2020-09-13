const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { User , userValidationSchema, userPutValidationSchema} = require('../models/user');
const { Producer } = require('../models/producer');
const { Customer } = require('../models/customer');
const { Admin } = require('../models/admin');


const auth = require('../middlewares/auth');
const { producer, user , admin, adminOrproducer, adminOrUser } = require('../middlewares/role');

const router = express.Router();

router.get('/', [auth,admin], async (req,res) => {
    try {
        const users = await User.find({}).select({ _id: 1, phoneNumber: 1,customerOrProducerId:1, _v : -1});
        if(users){
            res.status(200).send(users);
        }
        else {
            throw new Error("Users Not Found");
        }
    } 
    catch (error) {
       res.status(404).send(error.message); 
    }
});

router.get('/:id', [auth,adminOrUser], async(req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){
            const user = await User.findById(id);
            if(user){
                res.status(200).send(user);
            }
            else {
                throw new Error("User with that ID not found");
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

router.delete('/:id',[auth,adminOrUser], async(req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){
            const userDeleted = await User.findByIdAndDelete(id);
            if(userDeleted){
                res.status(200).send(userDeleted);
            }
            else {
                throw new Error('User with that ID not found');
            }
        }
        else {
            throw new Error('Invalid UserID')
        }
    } 
    catch (error) {
        res.status(400).send(error.message)
    }
});

router.post('/', async(req,res) => {
    try {
        const { error } = userValidationSchema.validate(req.body);
        if(error){
            throw new Error(error.message);
        }
        else {
            const producerOrCustomerOrAdmin = (await Customer.findById(req.body.ID)) || (await Producer.findById(req.body.ID) || (await Admin.findById(req.body.ID)));
            if(producerOrCustomerOrAdmin){
                const duplicate = await User.find({customerOrProducerOrAdminId : req.body.ID});
                if(duplicate.length === 0){
                    const role = findRole(producerOrCustomerOrAdmin);
                    const salt = await bcrypt.genSalt(10);  
                    const hashedPassword = await bcrypt.hash(req.body.password,salt);                        
                    const user = new User({
                        phoneNumber : producerOrCustomerOrAdmin.phoneNumber,
                        password : hashedPassword,
                        customerOrProducerOrAdminId : req.body.ID,
                        role : role
                    });
                    if(user){
                        await user.save();
                        const hiddenPassword = await User.findById(user._id).select("phoneNumber customerOrProducerId");
                        
                        const token = user.generateAuthToken();
                        res.header('x-auth-token',token).send(hiddenPassword);
                    }
                    else {
                        throw new Error('Failed to save to the database');
                    }
                }
                else {
                    throw new Error('Duplicate USER')
                }
            }
            else {
                throw new Error('no producer,customer or admin found.\nPlease Register as a Producer,Customer or Admin')
            }
        }
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.put('/:id',[auth,user], async (req,res) => {
    try {
       const { error } = userPutValidationSchema.validate(req.body);
       const userId = req.params.id;
       if(error){
           throw new Error(error.message);
       }
       else {
            if(mongoose.Types.ObjectId.isValid(userId)){
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(req.body.password,salt);
                const response = await User.findByIdAndUpdate(userId,{
                   password : hashed
                }, { new : true }).select("phoneNumber customerOrProducerOrAdminId password");
                
                res.status(200).send(response);
            }
            else {
               throw new Error('Invalid User Id');
            }
       }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

function findRole (a) {
    let role = "";
    if( a.location) role = "user"
    else if (a.rating) role = "producer"
    else  role = "admin"
    return role;
};
module.exports = router;