import { useState, useEffect } from 'react'
import axios from 'axios'
import { Package, RefreshCw, AlertCircle } from 'lucide-react'

function App() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProductos = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:3000/api/productos')
      setProductos(response.data)
    } catch (error) {
      console.error("Error al conectar con el backend:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductos()
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Package color="#3498db" size={32} /> Panel de Inventario
        </h1>
        <button
          onClick={fetchProductos}
          style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#3498db', color: 'white', border: 'none' }}
        >
          <RefreshCw size={18} className={loading ? 'spin' : ''} /> Actualizar
        </button>
      </header>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {productos.map(p => (
            <div key={p.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: 0, color: '#34495e' }}>{p.nombre}</h3>
                <span style={{ fontSize: '0.8rem', color: '#95a5a6' }}>{p.sku}</span>
              </div>
              <hr style={{ margin: '1rem 0', opacity: 0.2 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#7f8c8d' }}>Stock Disponible</p>
                  <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: p.stock_actual < 5 ? '#e74c3c' : '#27ae60' }}>
                    {p.stock_actual}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#7f8c8d' }}>Precio</p>
                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>${p.precio_venta}</p>
                </div>
              </div>
              {p.stock_actual < 5 && (
                <div style={{ marginTop: '1rem', color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }}>
                  <AlertCircle size={14} /> ¡Bajo Stock!
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App