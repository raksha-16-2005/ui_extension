/**
 * HTTP 500 Error: Internal Server Error
 * This simulates a 500 HTTP error response from an API
 */

export function runError() {
  // Simulate a 500 Internal Server Error
  const error = new Error("HTTP 500: Internal Server Error");
  error.statusCode = 500;
  error.response = {
    status: 500,
    statusText: "Internal Server Error",
    message: "An unexpected error occurred on the server"
  };

  throw error;
}
