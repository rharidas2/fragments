# POST a JSON fragment
POST http://localhost:3000/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password123

`{"note":"This is a JSON fragment!"}`

# Expect HTTP 201 Created
HTTP/1.1 201
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.size" == 32

# Capture the Location header URL
[Captures]
url: header "Location"

# GET the fragment
GET {{url}}
[BasicAuth]
user1@email.com:password123

HTTP/1.1 200
Content-Type: application/json
[Asserts]
body == `{"note":"This is a JSON fragment!"}`
