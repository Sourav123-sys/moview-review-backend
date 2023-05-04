const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
//connect to db

console.log(process.env.db_user)
console.log(process.env.db_pass)
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.eowzq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

mongoose.connect(uri).
then(() => {
    console.log("db is connected");
}).catch((err) => {
    console.log("db connection failed :",err);
})