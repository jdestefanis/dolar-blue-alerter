var MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb://localhost/dollarblue", { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
    db.close();
});
