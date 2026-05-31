import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);

  // Persist cart in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === item.id);
      if (exist) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    setOpenDrawer(true); // Open drawer automatically
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: (i.quantity || 1) - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const clearCart = () => setCart([]);

  // Totals
  const subtotal = useMemo(
    () => cart.reduce((sum, i) => sum + (i.salePrice ?? i.price ?? 0) * (i.quantity ?? 1), 0),
    [cart]
  );
  const shipping = useMemo(() => (subtotal > 100 || subtotal === 0 ? 0 : 6.9), [subtotal]);
  const total = useMemo(() => +(subtotal + shipping).toFixed(2), [subtotal, shipping]);

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

export const useCart = () => useContext(CartContext);
