const cds = require("@sap/cds");
const MongoCLient = require("mongodb").MongoClient;
const uri = process.env.DATABASE_URL;
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

    if (req.query.SELECT.one) {
        var sId = req.query.SELECT.from.ref[0].where[2].val;
        filter = { _id: ObjectId(sId) };
    }

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

    for (var i = 0; i < results.length; i++) {
        results[i].id = results[i]._id.toString();
    }

    return results;
}

module.exports = cds.service.impl(function () {
    const { customer } = this.entities;
    this.on("INSERT", customer, _createCustomer);
    this.on("READ", customer, _getAllCustomers);
});
