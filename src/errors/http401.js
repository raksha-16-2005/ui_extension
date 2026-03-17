/**
 * HTTP 401 Error: Unauthorized
 * This simulates a 401 HTTP error response from an API
 */

export function runError() {
  // Simulate a 401 Unauthorized error
  const error = new Error("HTTP 401: Unauthorized");
  error.statusCode = 401;
  error.response = {
    status: 401,
    statusText: "Unauthorized",
    message: "Authentication credentials were missing or invalid"
  };

  throw error;
}
