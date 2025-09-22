const { createSuccessResponse, createErrorResponse } = require('../../src/response');

describe('response.js', () => {
  test('createSuccessResponse should wrap data with status ok', () => {
    const data = { user: 'Rohith' };
    const result = createSuccessResponse(data);
    expect(result).toEqual({
      status: 'ok',
      user: 'Rohith',
    });
  });

  test('createErrorResponse should return error object with code and message', () => {
    const result = createErrorResponse(404, 'Not Found');
    expect(result).toEqual({
      status: 'error',
      error: {
        code: 404,
        message: 'Not Found',
      },
    });
  });
});
