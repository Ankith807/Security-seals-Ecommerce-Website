import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('raibex_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('raibex_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add Item to Cart
  const addToCart = (product, quantity = 1, customPrintText = '') => {
    setCartItems((prevItems) => {
      // Find if item already exists with the SAME product ID and the SAME custom marking text
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product === product._id && item.customPrintText === customPrintText
      );

      if (existingItemIndex > -1) {
        // Increment quantity of existing item
        const newItems = [...prevItems];
        const newQty = newItems[existingItemIndex].quantity + quantity;
        
        // Ensure quantity doesn't exceed stock
        newItems[existingItemIndex].quantity = Math.min(newQty, product.stock);
        return newItems;
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: Math.min(quantity, product.stock),
            image: product.images?.[0] || '',
            customPrintText,
            maxStock: product.stock
          }
        ];
      }
    });
  };

  // Remove Item from Cart
  const removeFromCart = (productId, customPrintText = '') => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product === productId && item.customPrintText === customPrintText)
      )
    );
  };

  // Update Item Quantity
  const updateQuantity = (productId, customPrintText = '', quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, customPrintText);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product === productId && item.customPrintText === customPrintText
          ? { ...item, quantity: Math.min(quantity, item.maxStock) }
          : item
      )
    );
  };

  // Clear all items in cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get total count of items in cart
  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  // Get total price of items in cart
  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
