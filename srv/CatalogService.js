const cds = require("@sap/cds");
const MongoCLient = require("mongodb").MongoClient;
const uri =
    "mongodb://ercoleTraining:1mCYNEsW91ud8CzV@ac-vjo9hxr-shard-00-00.frwpxmh.mongodb.net:27017,ac-vjo9hxr-shard-00-01.frwpxmh.mongodb.net:27017,ac-vjo9hxr-shard-00-02.frwpxmh.mongodb.net:27017/?ssl=true&replicaSet=atlas-2th2tu-shard-0&authSource=admin&retryWrites=true&w=majority";
const db_name = "capmongo";
const client = new MongoCLient(uri);
const ObjectId = require("mongodb").ObjectId;

async function _createCustomer(req) {
    await client.connect();
    var db = await client.db(db_name);
    var customer = await db.collection("customer");
    const results = await customer.insertOne(req.data);

    if (results.insertedId) {
        req.data.id = results.insertedId;
    }
    return req.data;
}

async function _getAllCustomers(req) {
    // Connect the client to the server
    await client.connect();
    // Establish and verify the connection
    var db = await client.db(db_name);

    // setup $Top en $ SKIP
    var filter, results, limit, offset;
    if (req.query.SELECT.limit) {
        limit = req.query.SELECT.limit.rows.val;
        if (req.query.SELECT.limit.offset) {
            offset = req.query.SELECT.limit.offset.val;
        } else {
            offset = 0;
        }
    } else {
        limit = 1000;
        offset = 0;
    }

    var collection_Customers = await db.collection("customer");
    results = await collection_Customers
        .find(filter)
        .limit(offset + limit)
        .toArray();

    results = results.slice(offset);

    return results;
}

module.exports = cds.service.impl(function () {
    const { customer } = this.entities;
    this.on("INSERT", customer, _createCustomer);
    this.on("READ", customer, _getAllCustomers);
});
