/**
 * HTTP 401 Error Example:
 * Simulates accessing a protected API with invalid or missing auth token
 */

export function runError() {
  // Simulated stored auth token (could come from localStorage)
  const authToken = "expired_token_abc123"; // ❌ invalid/expired token

  // Step 1: Simulate login check
  function isAuthenticated(token) {
    if (!token) {
      throw createHttpError(
        401,
        "No authentication token provided. Please log in."
      );
    }
  }

  // Step 2: Simulate token validation (like backend check)
  function validateToken(token) {
    console.log("Validating token...");

    const isExpired = true; // simulate expired token

    if (isExpired) {
      throw createHttpError(
        401,
        "Session expired. Please log in again."
      );
    }
  }

  // Step 3: Simulated protected API request
  function fetchUserProfile(token) {
    console.log("Fetching user profile...");

    const serverRejects = true;

    if (serverRejects) {
      throw createHttpError(
        401,
        "Unauthorized access. Invalid authentication credentials."
      );
    }

    return {
      id: 202,
      name: "Alex Carter",
      email: "alex@example.com"
    };
  }

  // Helper: create structured HTTP error
  function createHttpError(status, message) {
    const error = new Error(`HTTP ${status}: Unauthorized`);
    error.statusCode = status;
    error.response = {
      status,
      statusText: "Unauthorized",
      message
    };
    return error;
  }

  // Step 4: Full flow
  function accessProtectedResource() {
    console.log("Accessing protected resource...");

    // Check if token exists
    isAuthenticated(authToken);

    // Validate token (will fail here)
    validateToken(authToken);

    // Fetch protected data (won't reach if above fails)
    const profile = fetchUserProfile(authToken);

    console.log("User profile:", profile);
  }

  // Execute → triggers 401 error
  accessProtectedResource();
}
