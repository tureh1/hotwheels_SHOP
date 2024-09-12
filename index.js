var express = require("express");
var cors = require("cors");
var ObjectId = require('mongodb').ObjectId;
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

app.use(express.static("public"));
app.use("/images", express.static("images"));

/* ----------------------------------------
        CONNECTING TO SERVER
   ---------------------------------------- */

const port = "8081";
const host = "localhost";

app.listen(port, () => {
    console.log("App listenting at http://%s:%s\n", host, port);
});

/* ----------------------------------------
        CONNECTING TO DATABASE
   ---------------------------------------- */

const { MongoClient } = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
const dbName = "final_project";
const client = new MongoClient(url);
const db = client.db(dbName);

/* ----------------------------------------
        POST NEW REQUEST
   ---------------------------------------- */

app.post("/add_product", async (req, res) => {
    await client.connect();
    console.log("Request: /add_product");
        
    const newProduct = req.body; // Data sent in the body of the POST request
    const query = {
        title: newProduct.title,
        price: Number(newProduct.price),
        description: newProduct.description,
        category: newProduct.category,
        image: newProduct.image,
        rating: {
            rate: Number(newProduct.rating.rate),
            count: Number(newProduct.rating.count)
        }
    }
    const result = await db.collection("index").insertOne(query);
        
    if(!result) {
        res.send("Product was not added").status(404);
    }
            
    else {
        res.status(201).send(result);
    }
});

/* ----------------------------------------
        GET ALL REQUEST
   ---------------------------------------- */

app.get("/index", async (req, res) => {
    await client.connect();
    console.log("Request: /index");
    
    const query = {};
    const results = await db.collection("index").find(query).toArray();
    console.log("ALL Items: ", results);
    
    res.status(200);
    res.send(results);
});

/* ----------------------------------------
        PUT ON ONE REQUEST
   ---------------------------------------- */

app.put("/change_product", async (req, res) => {
    await client.connect();
    console.log("Request: /change_product");
        
    const updateProduct = req.body; // Data sent in the body of the POST request
    const updateID = updateProduct._id;
    const query = {
        title: updateProduct.title,
        price: Number(updateProduct.price),
        description: updateProduct.description,
        category: updateProduct.category,
        image: updateProduct.image,
        rating: {
            rate: Number(updateProduct.rating.rate),
            count: Number(updateProduct.rating.count)
        }
    }
    const result = await db.collection("index").updateOne({_id: new ObjectId(updateID)}, {"$set": query});

    console.log(result);
        
    if(!result) {
        res.send("Product was not updated").status(404);
    }
            
    else {
        res.status(201).send(result);
    }
});

/* ----------------------------------------
        DELETE ONE REQUEST
   ---------------------------------------- */

   app.delete("/delete_product", async (req, res) => {
    await client.connect();
    console.log("Request: /delete_product");
    
    const deleteProduct = req.body; // Data sent in the body of the POST request
    const deleteID = deleteProduct._id;

    console.log(deleteID)

    const query = {_id: new ObjectId(deleteID)};
    const result = await db.collection("index").deleteOne(query);
    console.log("DELETE Item: ", result);
    
    res.status(200);
    res.send(result);
});


