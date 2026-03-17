/**
 * TypeError: Attempting to access a property on null
 * This demonstrates accessing a property on a null value
 */

export function runError() {
  // Trying to access property 'name' on null will throw a TypeError
  const obj = null;
  const value = obj.name; // TypeError: Cannot read property 'name' of null
  return value;
}
