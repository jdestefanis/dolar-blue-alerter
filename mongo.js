var MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb://dollarBlueMongoDB:27017/dollarblue", function(err, db) {
    db.close();
});
