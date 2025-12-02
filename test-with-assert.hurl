POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZXhhbXBsZS5jb206cGFzc3dvcmQx
Content-Type: application/json

test

> {%
    client.assert(response.status === 201);
%}
