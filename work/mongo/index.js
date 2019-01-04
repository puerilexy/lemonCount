var mongodb = require('mongodb');

var DB_address = 'mongodb://localhost:27017';

var mongoClient = mongodb.MongoClient;

var objectId = mongodb.ObjectID;

function createObjectId(id) {
    if (id && typeof id === 'string') {
        return objectId(id);
    }
}

function connect(collectionName,fn) {
    mongoClient.connect(DB_address, { useNewUrlParser: true }, function (err, con) {
        if (err) {
            return typeof fn === 'function' && fn(err);
        }
        var db = con.db('lemon');
        var collection = db.collection(collectionName);
        typeof fn === 'function' && fn(null, collection, con);
    })
}

module.exports = {
    connect: connect,
    createObjectId: createObjectId
}