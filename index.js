const express = require('express')
const app = express()
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 4500

//username watch-collection21
//password 5mbwnY9IFvmHCExD

 app.use(cors())
 app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ox5tn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
  try{
    await client.connect()
    console.log('connected');
    const database = client.db('products')
    const productCollection = database.collection("productCollection")
    const reviewsCollecttion = database.collection('reviewsCollecttion');
    const ordersCollection = database.collection('ordersCollection');


    //get product api
    app.get('/addedproduct', async (req, res) => {
      const cursor = productCollection.find({})
      const result = await cursor.toArray()
      res.send(result)
    })

    //get review api
    app.get('/addedreview', async (req, res) => {
      const cursor = reviewsCollecttion.find({})
      const result = await cursor.toArray()
      res.send(result)
    })
    //get order api
    app.get("/myorders", async (req, res) => {
      let query = {}
      const email = req.query.email;
      if (email) {
        query = { email: email }
      }
      const cursor = await ordersCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })
    //get product by id
    app.get("/addedproduct/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await productCollection.findOne(query)
      res.send(result)
    })
    //post api
    app.post('/addedproduct', async (req, res) => {
      const newProduct = req.body
      const result = productCollection.insertOne(newProduct)
      res.json(result)
    })

     // post review api
     app.post('/addedreview', async (req, res) => {
      const newReview = req.body
      const result = reviewsCollecttion.insertOne(newReview)
      res.json(result)
    })
    //post order api
    app.post('/myorders', async (req, res) => {
      const order = req.body
      const result = ordersCollection.insertOne(order)
      res.json(result)
    })
    //delete order api
    app.delete('/myorders/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await ordersCollection.deleteOne(query)
      res.json(result)
  })
  }
  finally{
      // await client.close()
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})