import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Confirmation from './components/confirmation'
import PaymentEntry from './components/paymentEntry'
import Purchase from './components/purchase'
import ShippingEntry from './components/shippingEntry'
import ShoppingCart from './components/shoppingCart'
import ViewOrder from './components/viewOrder'
import { CartProvider } from './context/CartContext'
import './App.css'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/purchase" replace />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/shippingEntry" element={<ShippingEntry />} />
            <Route path="/paymentEntry" element={<PaymentEntry />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/viewOrder" element={<ViewOrder />} />
            <Route path="/shoppingCart" element={<ShoppingCart />} />
          </Routes>
        </main>
        <footer className="site-footer">© All rights reserved 2026</footer>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
