import React, { useState } from 'react'

const Registro = () => {
  const [tipo, setTipo] = useState('ingreso')
  const [cantidad, setCantidad] = useState('')
  const sesiones = [
    'Embarazo',
    'Recien Nacido',
    'Bebe',
    'Smash Cake',
    'Familia',
    'Navidad',
    'Otros'
  ]
  const [sesion, setSesion] = useState(sesiones[0])
  const [descripcion, setDescripcion] = useState('')
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0])

  const guardarMovimiento = () => {
    if (!cantidad || isNaN(cantidad)) {
      alert('Por favor, introduce una cantidad válida.')
      return
    }

    const nuevoMovimiento = {
        id: Date.now(),
        tipo,
        cantidad: parseFloat(cantidad),
        descripcion,
        fecha,
        ...(tipo === 'ingreso' && { sesion }) // 👈 solo se guarda si es ingreso
      }

    const movimientosExistentes = JSON.parse(localStorage.getItem('movimientos')) || []
    const actualizados = [nuevoMovimiento, ...movimientosExistentes]
    localStorage.setItem('movimientos', JSON.stringify(actualizados))

    // Limpiar formulario
    setCantidad('')
    setDescripcion('')
    alert('Movimiento guardado ✅')
  }

  return (
    <div >
      <h2>📝 Registro de Movimiento</h2>

      <div >
        <label>Tipo:</label>
        <select value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="ingreso">Ingreso</option>
          <option value="gasto">Gasto</option>
        </select>
      </div>

      {tipo === 'ingreso' && (
        <div >
            <label>Sesión:</label>
            <select value={sesion} onChange={e => setSesion(e.target.value)}>
            {sesiones.map((s, idx) => (
                <option key={idx} value={s}>{s}</option>
            ))}
            </select>
        </div>
        )}

      <div >
        <label>Cantidad:</label>
        <input
          type="number"
          value={cantidad}
          onChange={e => setCantidad(e.target.value)}
        />
      </div>

      <div>
        <label>Descripción:</label>
        <input
          type="text"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
      </div>

      <div>
        <label>Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
        />
      </div>

      <button onClick={guardarMovimiento}>Guardar</button>
    </div>
  )
}

export default Registro
