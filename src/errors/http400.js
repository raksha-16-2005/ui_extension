/**
 * HTTP 400 Error: Bad Request
 * Simulates a form submission with invalid data that triggers a 400 Bad Request API error
 */

export function runError() {
  // Simulated form data (incomplete/invalid)
  const formData = {
    username: "", // Empty username - invalid!
    email: "invalid-email", // Invalid email format
    age: -5, // Invalid age
    country: null // Missing required field
  };

  // Step 1: Validate form fields
  function validateFormData(data) {
    const errors = [];

    if (!data.username || data.username.trim() === "") {
      errors.push("Username is required and cannot be empty");
    }

    if (!data.email || !data.email.includes("@")) {
      errors.push("Valid email address is required");
    }

    if (!data.age || data.age < 0 || data.age > 120) {
      errors.push("Age must be between 0 and 120");
    }

    if (!data.country) {
      errors.push("Country selection is required");
    }

    return errors;
  }

  // Step 2: Prepare API request
  function prepareApiRequest(formData) {
    console.log("Preparing API request with form data:", formData);

    const validationErrors = validateFormData(formData);

    if (validationErrors.length > 0) {
      const error = new Error("HTTP 400: Bad Request");
      error.statusCode = 400;
      error.response = {
        status: 400,
        statusText: "Bad Request",
        message: "The request was malformed or missing required parameters",
        errors: validationErrors,
        timestamp: new Date().toISOString(),
        path: "/api/register"
      };

      throw error;
    }

    return {
      username: formData.username,
      email: formData.email,
      age: formData.age,
      country: formData.country
    };
  }

  // Step 3: Submit form (this will trigger the 400 error)
  function submitForm(formData) {
    console.log("Submitting form data...");

    try {
      const requestPayload = prepareApiRequest(formData);
      console.log("Form submitted successfully:", requestPayload);
    } catch (error) {
      console.error("Form submission failed:", error.message);
      throw error;
    }
  }

  // Execute form submission (this will throw the 400 Bad Request error)
  submitForm(formData);
}
