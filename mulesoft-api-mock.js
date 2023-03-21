/*
    Mocking https://www.mulesoft.com/exchange/68ef9520-24e9-4cf2-b2f5-620025690913/catalyst-retail-order-system-api/
*/

var fs = require("fs");
//using orders.json to mock a DB.

module.exports = function(app){

  //this function checks whether the body data parsed is true or not, i am just mocking, there are too many edge cases to check here so I will return true or false as and when
  function createOrderBodyChecks(data, desiredResult){
    /* this is an example of the checks
    return ("subtotal" in data && parseFloat(data.subtotal) != NaN && 
            "taxPrice" in data && parseFloat(data.taxPrice) != NaN &&
            "shippingPrice" in data && parseFloat(data.shippingPrice) != NaN &&
            "total" in data && parseFloat(data.total) != NaN &&
            "status" in data && (data.status == "Draft" || data.status == "Completed" || data.status == "Processing") &&
            "trackingNumber" in data && ...
            );
    */
    return desiredResult;
  }

  //this function checks whether the customerID exists, i am just mocking, there are too many edge cases to check here so I will return true or false as and when
  function isValidCustomer(customerID, desiredResult=true){
    return desiredResult;
  }

  //just a sample update orders.json which mocks DB. pretty much takes everything in array 0 and just replaces the customerID to mock.
  function updateDBWithNewRecord(customerID, newcontent){
    var filename = __dirname + "/" + "orders.json";
    var file_content = fs.readFileSync(filename);
    var content = JSON.parse(file_content);
    var newContent = newcontent;
    newContent["identifier"] = Math.random().toString(16).slice(2);
    newContent["customerId"] = customerID;
    content.push(newContent);
    fs.writeFileSync(filename, JSON.stringify(content));
    return newContent;
  }

  //get orders 
  app.get('/api/orders/customer/:customerId', function (req, res) {
    const customerId = req.params.customerId.trim();
    var jsonData = []
    if(isValidCustomer(customerId)) {
      //call other service to get orders based on customerID. If there isn't any order, return empty array, if there is return data below.
      //the following is just an example i pulled from mulesoft documentation, based on customerID we should retrieve something similiar, but equivalent to customerId.
      fs.readFile( __dirname + "/" + "orders.json", 'utf8', function (err, filedata) {
        filedata = JSON.parse(filedata)
        for(var i = 0; i < filedata.length; ++i){
          
          if ("customerId" in filedata[i] && filedata[i].customerId.trim()==customerId){
            jsonData.push(filedata[i]);
          }
        }
        return res.status(200).json(jsonData); 
      });
    }
    else{
      return res.status(200).json(jsonData);
    }
  });

  //create orders
  app.post('/api/orders/customer/:customerId', function (req, res) {
    const customerId = req.params.customerId.trim();
    if(!isValidCustomer(customerId))
      res.status(404).json({
        "message": "Customer not found"
      });
    //order created successfully 201
    const bodyContent = req.body;
    console.log("--------------")
    //console.log(bodyCon)
    if(createOrderBodyChecks(bodyContent, true)){
      // should contain some code to update database here based on the body
      //for now I will return an example here
      var sampleReturn = updateDBWithNewRecord(customerId, bodyContent);     
      return res.status(201).json(sampleReturn); 
    }
    else{
      return res.status(400).json({
        "message": "Order not created"
      })
    }
  });


    //get order based on orderid
    app.get('/api/orders/:orderId', function (req, res) {
      const orderId = req.params.orderId.trim();
      fs.readFile( __dirname + "/" + "orders.json", 'utf8', function (err, filedata) {
        filedata = JSON.parse(filedata) 
        for(var i = 0; i < filedata.length; ++i){
          
          if ("identifier" in filedata[i] && filedata[i].identifier.trim()==orderId){
            return res.status(200).json(filedata[i]);
          }
        }
        return res.status(404).json({
          "message": "Order not found"
        });
      });
    });

    //update order based on order id
    app.put('/api/orders/:orderId', function (req, res) {
      try{
        const orderId = req.params.orderId.trim();
        var filename = __dirname + "/" + "orders.json";
        var file_content = fs.readFileSync(filename);
        var content = JSON.parse(file_content);
        for(var i =0; i<content.length; ++i){
          if(content[i].identifier === orderId){
            content[i] = req.body
            fs.writeFileSync(filename, JSON.stringify(content), {flag:'w'});
            return res.status(200).json({
              "message": "Order was updated"
            });
          }
        }
       return res.status(404).json({
            "message": "Order not found"
          });
      }
      catch(err){
        return res.status(400).json({
          "message": "Order not updated"
        });
      }
    });

    //delete order based on order id
    app.delete('/api/orders/:orderId', function (req, res) {
      const orderId = req.params.orderId.trim();
      var filename = __dirname + "/" + "orders.json";
      var file_content = fs.readFileSync(filename);
      var content = JSON.parse(file_content);
      var newContent = [];
      var found = false;
      for(var i =0; i<content.length; ++i){
        if(content[i].identifier != orderId){
          newContent.push(content[i]);
        }
        else
        {
          found = true;
        }
      }
      if(found){
        fs.writeFileSync(filename, JSON.stringify(newContent));

        return res.status(200).json({
          "message": "Order was deleted"
        });
      }
      else{
        return res.status(400).json({
          "message": "Order not deleted"
        });
      }
  });

  app.put('/api/orders/:orderId/status', function (req, res) {
    const orderId = req.params.orderId.trim();
    var bodycontent = req.body;
    if("status" in bodycontent && (bodycontent.status == "Draft" || bodycontent.status == "Completed" || bodycontent.status == "Processing")){
      var filename = __dirname + "/" + "orders.json";
      var file_content = fs.readFileSync(filename);
      var content = JSON.parse(file_content);
      for(var i = 0; i < content.length; ++i){
        if(content[i].identifier == orderId){
          content[i].status = bodycontent.status;
          fs.writeFileSync(filename, JSON.stringify(content));
          return res.status(200).json({
            "message": "Order status was updated"
          });
        }
      }
      return res.status(404).json({
        "message": "Order not found"
      });
    }
    else{
      return res.status(400).json({
        "message": "Order status not updated"
      });
    }
  });
}
