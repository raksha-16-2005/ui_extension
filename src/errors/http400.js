/**
 * HTTP 400 Error: Bad Request
 * This simulates a 400 HTTP error response from an API
 */

export function runError() {
  // Simulate a 400 Bad Request error
  const error = new Error("HTTP 400: Bad Request");
  error.statusCode = 400;
  error.response = {
    status: 400,
    statusText: "Bad Request",
    message: "The request was malformed or missing required parameters"
  };

  throw error;
}
