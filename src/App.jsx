import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Confirmation from './components/confirmation'
import PaymentEntry from './components/paymentEntry'
import Purchase from './components/purchase'
import ShippingEntry from './components/shippingEntry'
import ShoppingCart from './components/shoppingCart'
import ViewOrder from './components/viewOrder'
import { CartProvider } from './context/CartContext'
import './App.css'
import ContactUs from './components/ContactUs'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="site-wrapper">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/purchase" replace />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/shippingEntry" element={<ShippingEntry />} />
            <Route path="/paymentEntry" element={<PaymentEntry />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/viewOrder" element={<ViewOrder />} />
            <Route path="/shoppingCart" element={<ShoppingCart />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
