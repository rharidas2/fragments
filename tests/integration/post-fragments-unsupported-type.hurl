# POST with unsupported type
POST http://localhost:3000/v1/fragments
Content-Type: application/unsupported

`This should fail`

# Expect HTTP 415 Unsupported Media Type
HTTP/1.1 415
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.message" == "Unsupported Media Type"
