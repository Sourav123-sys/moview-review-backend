
//import
const express = require('express');
require('./db')
const cors = require('cors')
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 5000


//middleware

app.use(bodyParser.json())
//app.use(cors())
const corsConfig = {
    origin: true,
    credentials: true,
  }
  app.use(cors(corsConfig))
  app.options('*', cors(corsConfig))


//router
const userRouter = require("./routes/user")
const actorRouter = require("./routes/actor")



app.use("/api/user",userRouter);
app.use("/api/actor",actorRouter );






app.get("/", (req, res) => { 
  res.send('hello i am review application')
})
//check 
app.listen(port, () => {
    console.log(`server is running ${port}`)
})