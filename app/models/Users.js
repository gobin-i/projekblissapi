// app/models/userVoted.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UsersSchema   = new Schema({
    name: String,
    ic: String,
    email: String,
    phone: String,
    voteFor: String,
    slogan: String

});

module.exports = mongoose.model('Users', UsersSchema);