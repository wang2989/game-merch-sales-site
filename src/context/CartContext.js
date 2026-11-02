import { createContext, useContext, useState, useMemo, useCallback, createElement, useEffect, useRef } from 'react'
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
  email: '',
  shipping_email: '',
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
  refreshInventory: async () => {},
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

  const itemsRef = useRef(items)
  itemsRef.current = items

  const inFlightPromiseRef = useRef(null)
  const lastFetchedTimeRef = useRef(0)
  const activeControllerRef = useRef(null)

  const refreshInventory = useCallback(async ({ silent = true, force = false } = {}) => {
    // Return existing in-flight promise if one is already running
    if (inFlightPromiseRef.current && !force) {
      return inFlightPromiseRef.current
    }

    // Cooldown check: prevent duplicate requests if fetched within 2 seconds
    const now = Date.now()
    if (!force && now - lastFetchedTimeRef.current < 2000 && itemsRef.current.length > 0) {
      return itemsRef.current
    }

    if (force && activeControllerRef.current) {
      activeControllerRef.current.abort()
    }

    const controller = new AbortController()
    activeControllerRef.current = controller

    // Only switch status to loading on cold load or when silent is explicitly false
    setInventoryStatus((prevStatus) => {
      if (prevStatus === 'loaded' && silent) {
        return prevStatus
      }
      return 'loading'
    })

    const fetchPromise = (async () => {
      try {
        const inventory = await fetchItems(controller.signal)
        setItems(inventory)
        setInventoryStatus('loaded')
        setInventoryError('')
        lastFetchedTimeRef.current = Date.now()
        return inventory
      } catch (error) {
        if (error?.name === 'AbortError') return
        setItems((prevItems) => {
          // Graceful fallback: preserve existing items if background refresh encounters an issue
          if (prevItems.length === 0) {
            setInventoryStatus('error')
            setInventoryError(error instanceof Error ? error.message : String(error))
          }
          return prevItems
        })
      } finally {
        if (inFlightPromiseRef.current === fetchPromise) {
          inFlightPromiseRef.current = null
        }
        if (activeControllerRef.current === controller) {
          activeControllerRef.current = null
        }
      }
    })()

    inFlightPromiseRef.current = fetchPromise
    return fetchPromise
  }, [])

  useEffect(() => {
    refreshInventory({ silent: false })
  }, [refreshInventory])

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
      refreshInventory,
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
  }, [cart, items, inventoryStatus, inventoryError, refreshInventory, orderConfirmation, updateCart, resetCart])

  return createElement(CartContext.Provider, { value }, children)
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export function useInventorySync() {
  const { refreshInventory } = useCart()

  useEffect(() => {
    // Dispatch GET request on page display
    refreshInventory()

    // Dispatch GET request when user returns to window/tab
    const handleFocus = () => {
      refreshInventory()
    }

    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [refreshInventory])
}

export const useCartContext = useCart
export default CartContext
