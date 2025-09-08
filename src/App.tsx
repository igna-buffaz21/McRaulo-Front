import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>hola mundo</h1>} />
      <Route path="/prueba" element={<Home />} />
    </Routes>
  )
}

export default App