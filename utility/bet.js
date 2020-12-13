const { Bet } = require('../models/Bet');
const { User } = require('../models/User');

const addUser = async (userId, betId) => {   
    
}

module.exports.addCategory = async(category, betId) => {
    const original = await Bet.findById(betId);
    const result = await Bet.findByIdAndUpdate(betId,{
        createdBy : original.createdBy,
        category : [...original.category, category],
        isResolved : original.isResolved,
        deadlineDate : original.deadlineDate,
        deadlineTime : original.deadlineTime,
        users : original.users
    }, { new : true});

    return result;
}
let category = {
    description : "no you are not gonna get Laid today",
    priceOrMoney : 50
}
async function run(){
    const value = addUser(category,"5fd0db5837b7ec6682c8fa2a");
    console.log(value);
} 
run()