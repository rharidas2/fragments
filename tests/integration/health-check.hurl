# Health Check Test
GET http://localhost:3000

# Check HTTP version and status
HTTP/1.1 200

# Check cache-control header
Cache-Control: no-cache

# JSON assertions
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.author" isString
jsonpath "$.githubUrl" matches /^https:\/\/github.com\/.+/
jsonpath "$.version" matches /^\d+\.\d+\.\d+$/
