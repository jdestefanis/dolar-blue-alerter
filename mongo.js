var MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb://localhost/dollarblue", function(err, db) {
    db.close();
});
