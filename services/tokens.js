// Esta funcion es para crear tokens de authenticacion
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../config');

exports.createToken = function(email) {
  var payload = {
    sub: email,
    iat: moment().unix(),
    exp: moment().add(2, "days").unix(),
  };
  return jwt.encode(payload, config.tokenKey);
};

exports.createEmailToken = function(email) {
  var payload = {
    sub: email,
    iat: moment().unix(),
    exp: moment().add(1, "days").unix(),
  };
  return jwt.encode(payload, config.emailToken);
};