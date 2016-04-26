// app/models/finalist.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var finalistSchema   = new Schema({
    name: String,
    vote: {type: Number, default: 0}

});

module.exports = mongoose.model('finalist', finalistSchema);