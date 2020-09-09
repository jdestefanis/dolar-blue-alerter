// const ApiService = require('../services/api.service');
var request = require("request");

exports.getDollarBlue = async function(req, res, next) {
    console.log('-----------------------------------------------------');
    console.log('Get Dollar Blue');
    console.log('-----------------------------------------------------');
    try {
        // var dollarBlue = await ApiService.getDollarBlue();
        var dolarblueurl = "https://mercados.ambito.com//dolar/informal/variacion";

        request({
            url: dolarblueurl,
            json: true
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                res.status(200).json({dollarblue: body})
            }
        })    
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
    };
