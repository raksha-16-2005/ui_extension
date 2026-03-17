/**
 * ReferenceError Example:
 * Simulates a configuration-based API call where a required variable
 * is not defined, causing a runtime crash
 */

export function runError() {
  // Simulated app config (like environment variables)
  const config = {
    apiVersion: "v1",
    timeout: 5000
    // ❌ Missing: API_BASE_URL
  };

  // Step 1: Build API URL
  function buildApiUrl(endpoint) {
    console.log("Building API URL...");

    // ❌ Mistake: using variable that was never declared
    if (!API_BASE_URL) {
      throw new Error("API base URL is not configured");
    }

    return `${API_BASE_URL}/${config.apiVersion}/${endpoint}`;
  }

  // Step 2: Simulate API request
  function fetchUserData() {
    console.log("Fetching user data...");

    const url = buildApiUrl("users/101");

    console.log("Request URL:", url);

    return {
      id: 101,
      name: "Chris Morgan"
    };
  }

  // Step 3: App initialization
  function initializeApp() {
    console.log("Initializing application...");

    const user = fetchUserData();

    console.log("User loaded:", user);
  }

  // Execute → triggers ReferenceError
  initializeApp();
}
