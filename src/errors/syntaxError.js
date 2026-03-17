/**
 * SyntaxError: Invalid JSON.parse
 * This demonstrates parsing invalid JSON which throws a SyntaxError
 */

export function runError() {
  // Attempting to parse invalid JSON will throw a SyntaxError
  const invalidJSON = "{invalid json}";
  
  try {
    JSON.parse(invalidJSON); // SyntaxError: Unexpected token i in JSON at position 1
  } catch (error) {
    throw new Error(`SyntaxError caught: ${error.message}`);
  }
}
