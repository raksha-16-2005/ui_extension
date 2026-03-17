/**
 * HTTP 404 Error: Not Found
 * This simulates a 404 HTTP error response from an API
 */

export function runError() {
  // Simulate a 404 Not Found error
  const error = new Error("HTTP 404: Not Found");
  error.statusCode = 404;
  error.response = {
    status: 404,
    statusText: "Not Found",
    message: "The requested resource was not found on the server"
  };

  throw error;
}
