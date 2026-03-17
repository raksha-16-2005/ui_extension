/**
 * Delayed Promise Rejection
 * This demonstrates a promise that rejects after a delay (timeout)
 */

export function runError() {
  // Create a promise that rejects after a delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Delayed promise rejection: Timeout after 500ms"));
    }, 500);
  });
}
