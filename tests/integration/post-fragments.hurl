# POST a fragment
POST http://localhost:3000/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password123

`This is a fragment!`

# Expect HTTP 201 Created
HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:3000\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "text/plain"
jsonpath "$.fragment.size" == 19

# Capture the Location header URL into a variable
[Captures]
url: header "Location"

# GET the fragment we just posted
GET {{url}}
[BasicAuth]
user1@email.com:password123

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "This is a fragment!"
