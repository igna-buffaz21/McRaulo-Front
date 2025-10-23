import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/home';
import { Cart } from './pages/cart';
import PaymentMethods from './pages/payament';
import { Status } from './pages/status';

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>hola mundo</h1>} />
      <Route path="/productos" element={<Home />} />
      <Route path="/carrito" element={<Cart />} />
      <Route path="/pago" element={<PaymentMethods />} />
      <Route path="/estado-pago" element={<Status />} />
    </Routes>
  )
}

export default App