# POST without auth
POST http://localhost:3000/v1/fragments
Content-Type: text/plain

`This should fail`

# Expect HTTP 401 Unauthorized
HTTP/1.1 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.message" == "Unauthorized"
