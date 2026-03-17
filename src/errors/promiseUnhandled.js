/**
 * Unhandled Promise Rejection
 * This demonstrates a promise that rejects without a .catch() or try/catch
 */

export function runError() {
  // Create a promise that rejects, but don't handle the rejection
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Unhandled promise rejection: This error was not caught"));
    }, 100);
  });

  // Not catching the rejection creates an unhandled rejection error
  return promise;
}
