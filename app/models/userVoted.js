// app/models/userVoted.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserVotedSchema   = new Schema({
    fbid: String
});

module.exports = mongoose.model('UserVoted', UserVotedSchema);