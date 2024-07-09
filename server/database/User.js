const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    topics: {type: [String], required: true},
},{Timestamps: true})

module.exports = mongoose.model('User', UserSchema)