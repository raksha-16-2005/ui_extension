/**
 * TypeError Example:
 * Simulates fetching user profile data where a nested object is null
 * and accessing its property causes a crash
 */

export function runError() {
  // Simulated API call
  function fetchUserProfile() {
    return new Promise((resolve) => {
      console.log("Fetching user profile...");

      setTimeout(() => {
        resolve({
          id: 901,
          name: "Morgan Lee",
          profile: null // ❌ missing profile object
        });
      }, 300);
    });
  }

  // Step 1: Process user data
  function processUser(user) {
    console.log("Processing user data...");

    // ❌ TypeError occurs here
    const city = user.profile.address.city;

    return {
      id: user.id,
      name: user.name,
      city
    };
  }

  // Step 2: Full flow
  function loadUser() {
    console.log("Loading user...");

    return fetchUserProfile()
      .then((user) => {
        console.log("User received:", user);

        // This will crash due to null access
        const processed = processUser(user);

        return processed;
      })
      .then((result) => {
        // This won't execute
        console.log("Processed user:", result);
        return result;
      });
  }

  // Execute → triggers TypeError
  return loadUser();
}
