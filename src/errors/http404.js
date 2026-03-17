/**
 * HTTP 404 Error Example:
 * Simulates fetching a resource (e.g., product) that does not exist
 */

export function runError() {
  // Simulated database (empty or missing item)
  const database = {
    products: [
      { id: 1, name: "Laptop", price: 50000 },
      { id: 2, name: "Headphones", price: 2000 }
    ]
  };

  // Simulated request (user trying to fetch a product)
  const request = {
    productId: 99 // ❌ does not exist
  };

  // Step 1: Validate request
  function validateRequest(req) {
    if (!req.productId) {
      throw createHttpError(400, "Product ID is required");
    }
  }

  // Step 2: Fetch product from "database"
  function getProductById(id) {
    console.log("Searching for product with ID:", id);

    const product = database.products.find(p => p.id === id);

    if (!product) {
      throw createHttpError(
        404,
        `Product with ID ${id} was not found`
      );
    }

    return product;
  }

  // Step 3: Simulated API handler
  function fetchProduct(req) {
    console.log("Processing request...");

    validateRequest(req);

    const product = getProductById(req.productId);

    return {
      status: 200,
      data: product
    };
  }

  // Helper: create structured HTTP error
  function createHttpError(status, message) {
    const error = new Error(`HTTP ${status}: Not Found`);
    error.statusCode = status;
    error.response = {
      status,
      statusText: "Not Found",
      message
    };
    return error;
  }

  // Step 4: Execute flow → triggers 404
  const response = fetchProduct(request);

  console.log("Product found:", response);
}
