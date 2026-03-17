/**
 * Unhandled Promise Rejection Example:
 * Simulates loading dashboard data where one async task fails
 * and the error is NOT handled (no .catch or try/catch)
 */

export function runError() {
  // Simulated API calls
  function fetchUserDetails() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("User details loaded");
        resolve({ id: 701, name: "Taylor Reed" });
      }, 200);
    });
  }

  function fetchNotifications() {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        console.log("Fetching notifications...");

        // ❌ Simulate failure (server error)
        reject(
          new Error(
            "Unhandled promise rejection: Failed to load notifications (500)"
          )
        );
      }, 300);
    });
  }

  function fetchDashboardStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Dashboard stats loaded");
        resolve({ visits: 1200, sales: 300 });
      }, 150);
    });
  }

  // Step 1: Load dashboard data
  function loadDashboard() {
    console.log("Loading dashboard...");

    // Multiple async operations
    const userPromise = fetchUserDetails();
    const notificationsPromise = fetchNotifications(); // ❌ will reject
    const statsPromise = fetchDashboardStats();

    // Combine promises (but NO error handling!)
    return Promise.all([
      userPromise,
      notificationsPromise,
      statsPromise
    ]).then(([user, notifications, stats]) => {
      console.log("Dashboard loaded:", {
        user,
        notifications,
        stats
      });

      return { user, notifications, stats };
    });
  }

  // Step 2: Execute WITHOUT catch → unhandled rejection
  return loadDashboard();
}
