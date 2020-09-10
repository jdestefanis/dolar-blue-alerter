//Users Model
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const UsersSchema = new mongoose.Schema({
  email:     {type:String, trim:true, required: true, unique: true},
  value:     {type:String, trim:true, required: true},
  threshold: {type:Number, trim:true, required: true},
});
UsersSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Users', UsersSchema);