const express = require("express")
const MongoClient = require('mongodb').MongoClient;
const cors = require("cors")
const bodyParser = require("body-parser")
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ozmnc.mongodb.net/volunteer?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get("/", (req,res)=> {
    res.send("Database Connected")
})



client.connect(err => {
  const VolunteerCollection = client.db("volunteer").collection("VolunteerList");
  // post server
  app.post("/volunteer", (req,res)=> {
      const newVolunteer = req.body;
      VolunteerCollection.insertOne(newVolunteer)
      .then(result=> {
          res.send(result.insertedCount > 0)
      })
  })
  
  // read to server
  app.get('/volunteerlist', (req,res)=> {
      VolunteerCollection.find({email: req.query.email})
      .toArray((err, documents)=> {
          res.send(documents)
      })
  })

  // Admin delete 
  app.delete("/deleteId/:id", (req,res)=> {
      VolunteerCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result=> {
         res.send(result.deletedCount > 0)
      })
  })
  // get all admin
  app.get('/aladmin', (req,res)=> {
    VolunteerCollection.find({})
    .toArray((err, documents)=> {
        res.send(documents)
    })
})
  
});


app.listen(process.env.PORT || port)