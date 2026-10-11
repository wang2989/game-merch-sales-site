import { createContext, useContext, useState, useMemo, useCallback, createElement } from 'react'

export const initialOrder = {
  // Map of item id -> quantity; only items with a quantity are present
  buyQuantity: {},
  credit_card_number: '',
  expir_date: '',
  cvvCode: '',
  card_holder_name: '',
  name: '',
  address_1: '',
  address_2: '',
  city: '',
  state: '',
  zip: '',
}

export const initialCart = initialOrder

export const CartContext = createContext({
  cart: initialOrder,
  order: initialOrder,
  cartOrder: initialOrder,
  ...initialOrder,
  setCart: () => {},
  setOrder: () => {},
  setCartOrder: () => {},
  updateCart: () => {},
  updateOrder: () => {},
  resetCart: () => {},
  resetOrder: () => {},
})

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => ({
    ...initialOrder,
    buyQuantity: { ...initialOrder.buyQuantity },
  }))

  const updateCart = useCallback((updates) => {
    setCart((prev) => {
      const nextUpdates = typeof updates === 'function' ? updates(prev) : updates
      return {
        ...prev,
        ...nextUpdates,
      }
    })
  }, [])

  const resetCart = useCallback(() => {
    setCart({
      ...initialOrder,
      buyQuantity: { ...initialOrder.buyQuantity },
    })
  }, [])

  const value = useMemo(() => {
    const contextValue = {
      cart,
      order: cart,
      cartOrder: cart,
      ...cart,
      setCart,
      setOrder: setCart,
      setCartOrder: setCart,
      updateCart,
      updateOrder: updateCart,
      resetCart,
      resetOrder: resetCart,
      [Symbol.iterator]: function* () {
        yield cart
        yield setCart
      },
    }
    return contextValue
  }, [cart, updateCart, resetCart])

  return createElement(CartContext.Provider, { value }, children)
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const useCartContext = useCart
export default CartContext
