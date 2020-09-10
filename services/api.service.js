var Users = require('../models/users');


exports.updateUserData = async function (query) {
    try {
        await Users.findOneAndUpdate(
            { "email" : query.email }, 
            { $set: { "value" : query.value, "threshold" : query.threshold}},
            { upsert : true, returnNewDocument : true}, (err, doc) => {
            if (err) {
                console.log("error");
            }
            return doc;
        });
    } catch (e) {
        // Log Errors
        throw Error('Error updating user: ' + e.message)
    }
}
