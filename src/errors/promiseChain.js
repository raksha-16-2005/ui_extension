/**
 * Error in Promise Chain (.then())
 * This demonstrates an error thrown inside a .then() handler
 */

export function runError() {
  // Create a promise and throw an error inside .then()
  return Promise.resolve()
    .then(() => {
      // This will throw an error in the promise chain
      throw new Error("Error in promise chain: Something failed in .then()");
    })
    .then(() => {
      // This won't be executed due to the error above
      return "Success";
    });
}
