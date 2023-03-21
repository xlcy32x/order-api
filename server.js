const express = require('express');
const bodyParser = require('body-parser')
const http = require('http')
const https = require('https')
var app = express();
var jsonParser = bodyParser.json()
app.use(jsonParser);
require('./mulesoft-api-mock')(app);

const serverAddress = "http://127.0.0.1:8081"

app.get('/', function (req, res) {
   res.send('Hello World');
})


//this api is expected to be called from frontend service when a create order is entered, i.e. a proper json payload will be sent over.
app.post('/api-gatetway/createOrder', function(req,res){
    var content = req.body;
    var statusCode = 404;
    fetch(serverAddress+'/api/orders/customer/'+content.customerId, {
        method: 'POST',
        body: JSON.stringify(content),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) =>{statusCode = response.status; return response.json();})
        .then((body)=>res.status(statusCode).json(body))
});

//this api is expected to be called from frontend service when user wants to list all his order or an administrator wants to view a customers all orders.
app.get('/api-gatetway/getOrder/customer/:customerId', function(req,res){
    const customerId = req.params.customerId.trim();
    var statusCode = 404;
    fetch(serverAddress+'/api/orders/customer/'+customerId, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) =>{statusCode = response.status; return response.json();})
        .then((body)=>res.status(statusCode).json(body))
});

//this api is expected to be called from frontend service when user wants to see his order or for a administrator to view any order given order id.
app.get('/api-gatetway/getOrder/order/:orderId', function(req,res){
    const orderId = req.params.orderId.trim();
    var statusCode = 404;
    fetch(serverAddress+'/api/orders/'+orderId, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) =>{statusCode = response.status; return response.json();})
        .then((body)=>res.status(statusCode).json(body))
});

//this api is expected to be called from frontend service when user wants to update his order or for a administrator to update any order given order id.
app.put('/api-gatetway/getOrder/order/:orderId', function(req,res){
    const orderId = req.params.orderId.trim();
    var content = req.body;
    var statusCode = 404;
    fetch(serverAddress+'/api/orders/'+orderId, {
        method: 'PUT',
        body: JSON.stringify(content),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) =>{statusCode = response.status; return response.json();})
        .then((body)=>res.status(statusCode).json(body))
});

//this api is expected to be called from frontend service when administrator wants to delete any order given order id.
app.delete('/api-gatetway/getOrder/order/:orderId', function(req,res){
    const orderId = req.params.orderId.trim();
    //var content = req.body;
    var statusCode = 404;
    fetch(serverAddress+'/api/orders/'+orderId, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) =>{statusCode = response.status; return response.json();})
        .then((body)=>res.status(statusCode).json(body))
});

//this api is expected to be called from frontend service administrator wants to update any order status given order id.
app.put('/api-gatetway/getOrder/order-status/:orderId', function(req,res){
    const orderId = req.params.orderId.trim();
    var content = req.body;
    var statusCode = 404;
    fetch(serverAddress+'/api/orders/'+orderId+'/status', {
        method: 'PUT',
        body: JSON.stringify(content),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) =>{statusCode = response.status; return response.json();})
        .then((body)=>res.status(statusCode).json(body))
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log(server.address())
   console.log("Example app listening at http://%s:%s", host, port)
})