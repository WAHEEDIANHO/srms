const mongoose = require('mongoose');
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')


const staff = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    }, 
    pswrd:{
        type: String,
        required: true
    }
})

staff.statics.verifyPswrd = (pswrd, hash) =>{
    return bcrypt.compareSync(pswrd, hash)
}

staff.statics.hashPswrd = (pswrd) => {
    return bcrypt.hashSync(pswrd, bcrypt.genSaltSync(8), null)
}

module.exports = mongoose.model('Staff', staff)