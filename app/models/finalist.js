// app/models/finalist.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var finalistSchema   = new Schema({
    name: String,
    vote: {type: Number, default: 0},
    voters: [{
    	name: String, 
    	ic: String, 
    	phone: String, 
    	email: String, 
    	slogan: String, 
    	ans1: String, 
    	ans2: String, 
    	subscribe: {type:String, default:"No"}
    }]

});

module.exports = mongoose.model('finalist', finalistSchema);