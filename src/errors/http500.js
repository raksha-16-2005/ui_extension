/**
 * HTTP 500 Error Example:
 * Simulates a server-side failure while processing an order
 */

export function runError() {
  // Simulated incoming request
  const request = {
    userId: 301,
    items: [
      { id: 1, name: "Keyboard", price: 1500 },
      { id: 2, name: "Monitor", price: 12000 }
    ]
  };

  // Step 1: Validate request
  function validateRequest(req) {
    if (!req.userId) {
      throw createHttpError(400, "User ID is required");
    }

    if (!req.items || req.items.length === 0) {
      throw createHttpError(400, "Order must contain items");
    }
  }

  // Step 2: Simulated database operation
  function saveOrderToDatabase(order) {
    console.log("Saving order to database...");

    // Simulate unexpected server crash
    const dbConnectionLost = true;

    if (dbConnectionLost) {
      throw new Error("Database connection lost");
    }

    return {
      orderId: "ORD12345",
      status: "saved"
    };
  }

  // Step 3: Business logic (calculate total)
  function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
  }

  // Step 4: API handler
  function processOrder(req) {
    console.log("Processing order...");

    try {
      validateRequest(req);

      const totalAmount = calculateTotal(req.items);
      console.log("Total amount:", totalAmount);

      const result = saveOrderToDatabase(req);

      return {
        status: 200,
        data: result
      };
    } catch (err) {
      // Convert unexpected error into HTTP 500
      throw createHttpError(
        500,
        `Server failed while processing order: ${err.message}`
      );
    }
  }

  // Helper: structured HTTP error
  function createHttpError(status, message) {
    const error = new Error(`HTTP ${status}: Internal Server Error`);
    error.statusCode = status;
    error.response = {
      status,
      statusText: "Internal Server Error",
      message
    };
    return error;
  }

  // Step 5: Execute → triggers 500 error
  const response = processOrder(request);

  console.log("Order processed:", response);
}
