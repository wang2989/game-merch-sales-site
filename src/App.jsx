import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Confirmation from './components/confirmation'
import PaymentEntry from './components/paymentEntry'
import Purchase from './components/purchase'
import ShippingEntry from './components/shippingEntry'
import ViewOrder from './components/viewOrder'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/shippingEntry" element={<ShippingEntry />} />
        <Route path="/paymentEntry" element={<PaymentEntry />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/viewOrder" element={<ViewOrder />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
