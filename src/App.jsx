import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Registro from './pages/Registro'
import Reportes from './pages/Reportes'

function App() {
  console.log("✅ App cargada y renderizando")

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/reportes" element={<Reportes />} />
      </Routes>
    </div>
  )
}

export default App
