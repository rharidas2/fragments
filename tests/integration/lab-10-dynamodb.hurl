POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZXhhbXBsZS5jb206cGFzc3dvcmQx
Content-Type: application/json

{ "service": "DynamoDB" }

> {%
    client.assert(response.status === 201, "Expected 201 Created");
    client.global.set("fragment1_url", response.headers.Location);
    client.global.set("fragment1_id", response.headers.Location.split('/').pop());
%}

GET {{fragment1_url}}/info
Authorization: Basic dXNlcjFAZXhhbXBsZS5jb206cGFzc3dvcmQx

> {%
    client.assert(response.status === 200, "Expected 200 OK");
    client.assert(response.headers["Content-Type"] === "application/json", "Expected JSON content type");
    client.assert(response.json().fragment.id === client.global.get("fragment1_id"), "Fragment ID should match");
    client.assert(response.json().fragment.type === "application/json", "Fragment type should be application/json");
    client.assert(response.json().fragment.size === 24, "Fragment size should be 24");
%}

POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZXhhbXBsZS5jb206cGFzc3dvcmQx
Content-Type: text/markdown

DynamoDB is **great**.

> {%
    client.assert(response.status === 201, "Expected 201 Created");
    client.global.set("fragment2_url", response.headers.Location);
    client.global.set("fragment2_id", response.headers.Location.split('/').pop());
%}

GET {{fragment2_url}}/info
Authorization: Basic dXNlcjFAZXhhbXBsZS5jb206cGFzc3dvcmQx

> {%
    client.assert(response.status === 200, "Expected 200 OK");
    client.assert(response.headers["Content-Type"] === "application/json", "Expected JSON content type");
    client.assert(response.json().fragment.id === client.global.get("fragment2_id"), "Fragment ID should match");
    client.assert(response.json().fragment.type === "text/markdown", "Fragment type should be text/markdown");
    client.assert(response.json().fragment.size === 22, "Fragment size should be 22");
%}

GET http://localhost:8080/v1/fragments?expand=false
Authorization: Basic dXNlcjFAZXhhbXBsZS5jb206cGFzc3dvcmQx

> {%
    client.assert(response.status === 200, "Expected 200 OK");
    client.assert(response.json().fragments.includes(client.global.get("fragment1_id")), "Should include first fragment ID");
    client.assert(response.json().fragments.includes(client.global.get("fragment2_id")), "Should include second fragment ID");
%}

DELETE {{fragment1_url}}
Authorization: Basic dXNlcjFAZXhhbXBsZS5jb206cGFzc3dvcmQx

> {%
    client.assert(response.status === 200, "Expected 200 OK");
%}

GET {{fragment1_url}}
Authorization: Basic dXNlcjFAZXhhbXBsZS5jb206cGFzc3dvcmQx

> {%
    client.assert(response.status === 404, "Expected 404 Not Found");
%}

GET http://localhost:8080/v1/fragments?expand=false
Authorization: Basic dXNlcjFAZXhhbXBsZS5jb206cGFzc3dvcmQx

> {%
    client.assert(response.status === 200, "Expected 200 OK");
    client.assert(!response.json().fragments.includes(client.global.get("fragment1_id")), "Should NOT include first fragment ID");
    client.assert(response.json().fragments.includes(client.global.get("fragment2_id")), "Should include second fragment ID");
%}
