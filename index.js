const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.Db_USER}:${process.env.Db_pass}@cluster0.ofsmeh8.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    await client.connect();
    // database and collection name
    const serviceDB = client.db("carDoctor");
    const serviceCollection = serviceDB.collection("services");
    const bookingsCollection = serviceDB.collection("bookings");
    // get the data by creating an api

    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get data id wise

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const ID = id.trim();
      console.log("params", typeof id);
      const objid = new ObjectId(id);
      console.log(typeof objid);
      const query = {_id: new ObjectId(id)};

      // use 1 to get the options we want otherwise can give 0 or leave and _id
      // will be available by default if not given 0
      const options = {
        projection: {title: 1, price: 1, service_id: 1},
      };

      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    // ---------------Bookings---------------------

    // get the stored bookings
    // app.post("/bookings", async (req, res) => {
    //   const booking = req.body;
    //   console.log(booking);
    //   const result = await bookingsCollection.insertOne(booking);
    //   res.send(result);
    // });

    // to post the bookings to the db
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ping: 1});
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch {
    console.log("Invalid ObjectId:", error);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

app.get("/", (req, res) => {
  res.send("car doctor crud running");
});

app.listen(port, () => {
  console.log(`Car doctor crud running',${port}`);
});
