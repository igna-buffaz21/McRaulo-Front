import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Home } from './pages/home';
import { Cart } from './pages/cart';
import PaymentMethods from './pages/payament';
import { Status } from './pages/status';
import { Welcome } from './pages/welcome';
import { Cajero } from './pages/cajero';
import { PedidosPendientes } from './pages/pedidos-pendientes';
import { PedidosPreparacionC } from './pages/pedidos-preparacion';
import { PedidosListos } from './pages/pedidos-listos';

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0.15 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0.15 }}
    transition={{ duration: 0.20 }}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Welcome /></PageTransition>} />
        <Route path="/productos" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/carrito" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/pago" element={<PageTransition><PaymentMethods /></PageTransition>} />
        <Route path="/estado-pago" element={<PageTransition><Status /></PageTransition>} />
        <Route path="/comanda/cajero" element={<PageTransition><Cajero /></PageTransition>} />
        <Route path="/comanda/pedidos-pendientes" element={<PageTransition><PedidosPendientes /></PageTransition>} />
        <Route path="/comanda/pedidos-preparacion" element={<PageTransition><PedidosPreparacionC /></PageTransition>} />
        <Route path="/comanda/pedidos-listos" element={<PageTransition><PedidosListos /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

export default App