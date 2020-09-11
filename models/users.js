//Users Model
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const UsersSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'name is required'] },
  email:     {type:String, trim:true, required: true, unique: true},
  value:     {type:String, trim:true, required: true},
  threshold: {type:Number, trim:true, required: true},
  activated: {type:Boolean, trim:true},
  password: {type: String,required: [true, 'password is required']},
  resetPasswordToken: {type:String, required: false},
  resetPasswordExpires: {type:Date, required: false}
});

UsersSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
}

UsersSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Users', UsersSchema);