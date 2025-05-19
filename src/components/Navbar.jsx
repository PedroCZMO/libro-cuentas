import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <header style={{ textAlign: 'center', paddingTop: '1rem' }}>
      <img
        src="/Logo_VEO_N.png"
        alt="VEO Fotografía y Diseño"
        className="logo-veo"
      />
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/registro">Registro</Link>
      </nav>
    </header>
  )
}

export default Navbar
