/**
 * SyntaxError Example:
 * Simulates receiving malformed JSON from an API
 * and failing during parsing
 */

export function runError() {
  // Simulated API response (malformed JSON)
  function fetchApiResponse() {
    return new Promise((resolve) => {
      console.log("Fetching data from server...");

      setTimeout(() => {
        // ❌ Invalid JSON (missing quotes, wrong format)
        const response = "{ user: 'Sam Wilson', age: 30 }";
        resolve(response);
      }, 300);
    });
  }

  // Step 1: Parse JSON response
  function parseResponse(data) {
    console.log("Parsing response...");

    try {
      const parsedData = JSON.parse(data); // ❌ SyntaxError occurs here
      return parsedData;
    } catch (err) {
      // Wrap into a more descriptive app-level error
      throw new Error(
        `SyntaxError: Failed to parse server response → ${err.message}`
      );
    }
  }

  // Step 2: Process data
  function processData(parsed) {
    console.log("Processing data...");

    return {
      name: parsed.user,
      age: parsed.age
    };
  }

  // Step 3: Full flow
  function loadUserProfile() {
    console.log("Loading user profile...");

    return fetchApiResponse()
      .then((rawData) => {
        const parsed = parseResponse(rawData); // ❌ error thrown here
        return processData(parsed);
      })
      .then((result) => {
        // This won't execute
        console.log("User profile loaded:", result);
        return result;
      });
  }

  // Execute → triggers SyntaxError
  return loadUserProfile();
}
