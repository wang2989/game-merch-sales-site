import { createContext, useContext, useState, useMemo, useCallback, createElement, useEffect } from 'react'
import { fetchItems } from '../data/items'

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
  items: [],
  itemsById: {},
  inventoryStatus: 'loading',
  inventoryError: '',
  orderConfirmation: null,
  setOrderConfirmation: () => {},
})

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => ({
    ...initialOrder,
    buyQuantity: { ...initialOrder.buyQuantity },
  }))
  const [items, setItems] = useState([])
  const [inventoryStatus, setInventoryStatus] = useState('loading')
  const [inventoryError, setInventoryError] = useState('')
  const [orderConfirmation, setOrderConfirmation] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    fetchItems(controller.signal)
      .then((inventory) => {
        setItems(inventory)
        setInventoryStatus('loaded')
      })
      .catch((error) => {
        if (error?.name === 'AbortError') return
        setInventoryError(error instanceof Error ? error.message : String(error))
        setInventoryStatus('error')
      })

    return () => controller.abort()
  }, [])

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
    setOrderConfirmation(null)
  }, [])

  const value = useMemo(() => {
    const itemsById = Object.fromEntries(items.map((item) => [item.id, item]))
    const contextValue = {
      cart,
      order: cart,
      cartOrder: cart,
      ...cart,
      items,
      itemsById,
      inventoryStatus,
      inventoryError,
      orderConfirmation,
      setOrderConfirmation,
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
  }, [cart, items, inventoryStatus, inventoryError, orderConfirmation, updateCart, resetCart])

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
