# order-api
#Steps to run the program
#1 install node
#2 run the runbuild.sh to run the server.
#3 use api via postman or other libs like curl.


# mulesoft-api-mock.js contains mocking of mulesoft endpoints.
# orders.json is a file that mocks orders database. 

# test cases
# Get Order by customerid - /api-gatetway/getOrder/customer/{customerId} -> mulesoft http://127.0.0.1:8081/api/orders/customer/{customerid}
use http://127.0.0.1:8081/api/orders/customer/1964401a-a8b3-40c1-b86e-d8b9f75b5842 to grab a successful case. for a non-existent customer use any other order id.

# Create Order via customerid - /api-gatetway/createOrder -> mulesoft http://127.0.0.1:8081/api/orders/customer/{customerid} 
toggle isValidCustomer and createOrderBodyChecks for mocking case checks. http://127.0.0.1:8081/api/orders/customer/1964401a-a8b3-40c1-b86e-d8b9f75b5842 to grab a successful case.


# Get order by orderid - /api-gatetway/getOrder/order/{orderId} -> mulesoft http://127.0.0.1:8081/api/orders/{orderId}
use http://127.0.0.1:8081/api/orders/51c0ba3a-7e64-11e7-bb31-be2e44b06b34 to grab a successful case. use any other order id for a negative case.

# Put order by orderid - /api-gatetway/getOrder/order/{orderId} -> mulesoft http://127.0.0.1:8081/api/orders/{orderId}
use http://127.0.0.1:8081/api/orders/51c0ba3a-7e64-11e7-bb31-be2e44b06b34 for a successful case, use any other order id for a negative case.

# delete order by orderid - /api-gatetway/getOrder/order/{orderId} -> mulesoft http://127.0.0.1:8081/api/orders/{orderId}
use http://127.0.0.1:8081/api/orders/51c0ba3a-7e64-11e7-bb31-be2e44b06b34 for a successful case, use any other order id for a negative case.

# put order status by order id - /api-gatetway/getOrder/order-status/{orderId} -> mulesoft http://127.0.0.1:8081/api/orders/{orderId}/status
body only expects Processing, Completed, Draft i.e. {"status" : "Processing"}
use http://127.0.0.1:8081/api/orders/51c0ba3a-7e64-11e7-bb31-be2e44b06b34 for a successful case, use any other order id for a negative case.