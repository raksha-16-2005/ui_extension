/**
 * Promise Chain Error Example:
 * Simulates fetching user data and failing during processing in .then()
 */

export function runError() {
  // Simulated API response
  function fetchUserData() {
    return new Promise((resolve) => {
      console.log("Fetching user data...");

      setTimeout(() => {
        resolve({
          id: 501,
          name: "Jordan Blake",
          email: "jordan@example.com",
          profile: null // ❌ problematic field
        });
      }, 500);
    });
  }

  // Step 1: Fetch data
  return fetchUserData()
    .then((user) => {
      console.log("User data received:", user);

      // Step 2: Process data (error happens here)
      return processUserProfile(user);
    })
    .then((processedData) => {
      // This will NOT execute due to error above
      console.log("Processed Data:", processedData);
      return processedData;
    });
}

// Separate function for processing
function processUserProfile(user) {
  console.log("Processing user profile...");

  // Simulate transformation logic
  if (!user.profile) {
    // ❌ Error inside promise chain
    throw new Error(
      "Error in promise chain: User profile data is missing"
    );
  }

  return {
    id: user.id,
    displayName: user.name.toUpperCase(),
    profileCompleted: true
  };
}
