import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { saveAs } from 'file-saver'


const Dashboard = () => {
  const resetearApp = () => {
    if (confirm('¿Seguro que quieres borrar todos los movimientos? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('movimientos')
      setMovimientos([])
      alert('Datos eliminados correctamente.')
    }
  } 

  const formatoEuro = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  })
  
  const exportarCSV = () => {
    if (movimientos.length === 0) {
      alert('No hay movimientos que exportar.')
      return
    }
  
    const encabezado = 'Tipo,Cantidad,Descripción,Fecha,Sesión\n'
    const filas = movimientos.map(m => {
      return [
        m.tipo,
        m.cantidad,
        `"${m.descripcion}"`,
        m.fecha,
        m.sesion || ''
      ].join(',')
    })
  
    const totalIngresos = movimientos
      .filter(m => m.tipo === 'ingreso')
      .reduce((acc, m) => acc + m.cantidad, 0)
  
    const totalGastos = movimientos
      .filter(m => m.tipo === 'gasto')
      .reduce((acc, m) => acc + m.cantidad, 0)
  
    const balance = totalIngresos - totalGastos
  
    const resumen = [
      '',
      '',
      '',
      '',
      '',
      `\nTotales:`,
      `Ingresos: ${formatoEuro.format(totalIngresos)}`,
      `Gastos: ${formatoEuro.format(totalGastos)}`,
      `Balance: ${formatoEuro.format(balance)}`

    ]
  
    const contenido = encabezado + filas.join('\n') + '\n\n' + resumen.join('\n')
  
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8' })
    saveAs(blob, `movimientos_${new Date().toISOString().split('T')[0]}.csv`)
  }
  
  const [movimientos, setMovimientos] = useState([])

  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroSesion, setFiltroSesion] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  const filtrarMovimientos = () => {
    const guardados = JSON.parse(localStorage.getItem('movimientos')) || []

    const filtrados = guardados.filter(m => {
      const fechaOk =
        (!fechaDesde || m.fecha >= fechaDesde) &&
        (!fechaHasta || m.fecha <= fechaHasta)

      const tipoOk = !filtroTipo || m.tipo === filtroTipo
      const sesionOk = !filtroSesion || m.sesion === filtroSesion

      return fechaOk && tipoOk && sesionOk
    })

    setMovimientos(filtrados)
  }

  useEffect(() => {
    filtrarMovimientos()
  }, [filtroTipo, filtroSesion, fechaDesde, fechaHasta])

  const totalIngresos = movimientos
    .filter(m => m.tipo === 'ingreso')
    .reduce((acc, curr) => acc + curr.cantidad, 0)

  const totalGastos = movimientos
    .filter(m => m.tipo === 'gasto')
    .reduce((acc, curr) => acc + curr.cantidad, 0)

  const balance = totalIngresos - totalGastos

  return (
    <div >
      <h2>📊 Dashboard</h2>

      <div >
        <h3>🔍 Filtros</h3>

        <label>Tipo:&nbsp;
          <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
            <option value="">Todos</option>
            <option value="ingreso">Ingreso</option>
            <option value="gasto">Gasto</option>
          </select>
        </label>

        &nbsp;&nbsp;

        <label>Sesión:&nbsp;
          <select value={filtroSesion} onChange={e => setFiltroSesion(e.target.value)}>
            <option value="">Todas</option>
            <option>Embarazo</option>
            <option>Recien Nacido</option>
            <option>Bebe</option>
            <option>Smash Cake</option>
            <option>Familia</option>
            <option>Navidad</option>
            <option>Otros</option>
          </select>
        </label>

        <br /><br />

        <label>Desde: <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} /></label>
        &nbsp;
        <label>Hasta: <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} /></label>
      </div>

      <div >
      <p><strong>Total Ingresos:</strong> {formatoEuro.format(totalIngresos)}</p>
      <p><strong>Total Gastos:</strong> {formatoEuro.format(totalGastos)}</p>
      <p><strong>Balance Neto:</strong> {formatoEuro.format(balance)}</p>

      </div>

      <h3>📋 Movimientos</h3>
      <ul>
        {movimientos.length === 0 ? (
          <li>No hay movimientos para estos filtros.</li>
        ) : (
          movimientos.map(m => (
            <li key={m.id}>
              <strong>{m.tipo === 'ingreso' ? '🟢' : '🔴'} {formatoEuro.format(m.cantidad)}</strong>
              – {m.descripcion} ({m.fecha})<br />
              {m.sesion && <small>🗂️ Sesión: {m.sesion}</small>}
            </li>
          ))
        )}
      </ul>
      <h3>📊 Gráfico Ingresos vs Gastos</h3>
      <div className="grafico-wrapper">
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={[
          { name: 'Ingresos', value: totalIngresos },
          { name: 'Gastos', value: totalGastos }
        ]}
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        label
        dataKey="value"
      >
        <Cell fill="#4caf50" />
        <Cell fill="#f44336" />
      </Pie>
      <Tooltip />
      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
    </PieChart>
  </ResponsiveContainer>
</div>
<button onClick={exportarCSV}>⬇️ Exportar a CSV</button>
<button onClick={resetearApp} >
  🧹 Borrar todos los datos
</button>

    </div>
  )
}

export default Dashboard
