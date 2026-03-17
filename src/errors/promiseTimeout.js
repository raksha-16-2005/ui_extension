/**
 * Delayed Promise Rejection Example:
 * Simulates an API request that times out due to slow response
 */

export function runError() {
  // Simulated API call
  function fetchOrderStatus(orderId) {
    return new Promise((resolve) => {
      console.log("Fetching order status for ID:", orderId);

      // Simulate slow server response
      const serverDelay = 1000; // 1 second delay

      setTimeout(() => {
        resolve({
          orderId,
          status: "Shipped"
        });
      }, serverDelay);
    });
  }

  // Timeout wrapper
  function withTimeout(promise, timeoutMs) {
    return new Promise((resolve, reject) => {
      // Timer to reject
      const timer = setTimeout(() => {
        reject(
          new Error(
            `Request timeout: Server took longer than ${timeoutMs}ms`
          )
        );
      }, timeoutMs);

      // Handle actual promise
      promise
        .then((result) => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  // Step 1: Make API call with timeout
  function getOrderStatus(orderId) {
    console.log("Starting API request...");

    const apiCall = fetchOrderStatus(orderId);

    // Apply timeout (this will fail)
    return withTimeout(apiCall, 500);
  }

  // Step 2: Execute flow
  return getOrderStatus("ORD789")
    .then((data) => {
      // This won't run due to timeout rejection
      console.log("Order Status:", data);
      return data;
    });
}
