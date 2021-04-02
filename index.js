const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wvime.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("greenValley").collection("products");
    const checkoutCollection = client.db("greenValley").collection("checkouts");

    app.get('/products', (req, res) => {
        productCollection.find()
            .toArray((err, products) => {
                res.send(products)
            })
    })

    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        productCollection.insertOne(newProduct)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/checkout/:id', (req, res) => {
        productCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addOrders', (req, res) => {
        const newOrders = req.body;
        checkoutCollection.insertOne(newOrders)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/orders', (req, res) => {
        checkoutCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.delete('/delete/:id', (req, res) => {
        productCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })

});



app.listen(port)