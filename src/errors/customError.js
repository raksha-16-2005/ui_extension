/**
 * Custom Error Example:
 * Simulates a real-world checkout process with validation,
 * API simulation, and a custom error being thrown.
 */

export function runError() {
  // Simulated user data (could come from a form)
  const user = {
    id: 101,
    name: "Raksha",
    email: "raksha@example.com",
    isLoggedIn: true,
    cart: [
      { id: 1, name: "Laptop", price: 50000 },
      { id: 2, name: "Mouse", price: 1500 }
    ]
  };

  // Step 1: Validate user login
  function validateUser(user) {
    if (!user || !user.isLoggedIn) {
      throw new Error("User not authenticated. Please log in.");
    }
  }

  // Step 2: Validate cart items
  function validateCart(cart) {
    if (!cart || cart.length === 0) {
      throw new Error("Cart is empty. Add items before checkout.");
    }

    cart.forEach(item => {
      if (!item.price || item.price <= 0) {
        throw new Error(`Invalid price for item: ${item.name}`);
      }
    });
  }

  // Step 3: Calculate total amount
  function calculateTotal(cart) {
    return cart.reduce((total, item) => total + item.price, 0);
  }

  // Step 4: Simulate API payment request
  function processPayment(amount) {
    console.log("Processing payment of ₹" + amount);

    // Simulate failure condition
    const paymentGatewayDown = true;

    if (paymentGatewayDown) {
      throw new Error(
        "Payment failed: Unable to connect to payment gateway. Please try again later."
      );
    }

    return { status: "success", transactionId: "TXN12345" };
  }

  // Step 5: Checkout flow
  function checkout(user) {
    console.log("Starting checkout...");

    validateUser(user);
    validateCart(user.cart);

    const total = calculateTotal(user.cart);
    console.log("Total amount:", total);

    const paymentResult = processPayment(total);

    console.log("Payment successful:", paymentResult);
  }

  // Execute checkout (this will throw the custom error)
  checkout(user);
}
