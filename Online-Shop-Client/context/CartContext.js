import { createContext, useContext, useState, useEffect, useMemo } from "react";

/**
 * CartContext
 * --------------------------------------------------
 * Purpose:
 * - Stores and manages shopping cart data globally
 * - Allows any component to access cart state
 * - Handles cart persistence using localStorage
 */

const CartContext = createContext();

/**
 * CartProvider Component
 * --------------------------------------------------
 * Wraps the application and provides cart-related
 * state and functions via React Context.
 *
 * @param {ReactNode} children - Components that need access to cart data
 */
export const CartProvider = ({ children }) => {
  /**
   * State: cart items
   */
  const [cart, setCart] = useState([]);

  /**
   * State: controls visibility of cart drawer
   */
  const [openDrawer, setOpenDrawer] = useState(false);

  /**
   * Load cart from localStorage on first render
   */
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  /**
   * Save cart to localStorage whenever it changes
   */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /**
   * Add item to cart
   * - If item already exists, increase quantity
   * - Otherwise, add item with quantity = 1
   * - Automatically opens cart drawer
   */
  const addToCart = (item) => {
    setCart((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);

      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: (i.quantity || 1) + 1 }
            : i
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });

    setOpenDrawer(true);
  };

  /**
   * Decrease quantity of a cart item
   * - Removes item if quantity reaches zero
   */
  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  /**
   * Remove item from cart completely
   */
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * Clear entire cart
   */
  const clearCart = () => setCart([]);

  /**
   * Calculate subtotal
   * - Uses sale price if available
   * - Memoized for performance
   */
  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum + (item.salePrice ?? item.price ?? 0) * (item.quantity ?? 1),
        0
      ),
    [cart]
  );

  /**
   * Calculate shipping cost
   * - Free shipping over €100 or if cart is empty
   */
  const shipping = useMemo(
    () => (subtotal > 100 || subtotal === 0 ? 0 : 6.9),
    [subtotal]
  );

  /**
   * Calculate total price
   */
  const total = useMemo(
    () => +(subtotal + shipping).toFixed(2),
    [subtotal, shipping]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        openDrawer,
        setOpenDrawer,
        subtotal,
        shipping,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Custom Hook: useCart
 * --------------------------------------------------
 * Simplifies access to CartContext
 */
export const useCart = () => useContext(CartContext);
