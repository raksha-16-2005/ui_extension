/**
 * ReferenceError: Using an undefined variable
 * This demonstrates referencing a variable that doesn't exist
 */

export function runError() {
  // Using a variable that was never declared will throw a ReferenceError
  console.log(undefinedVariable); // ReferenceError: undefinedVariable is not defined
  return undefinedVariable;
}
