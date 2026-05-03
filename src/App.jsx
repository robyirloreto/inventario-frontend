import { useState, useEffect } from 'react'
import axios from 'axios'
import { Package, RefreshCw, AlertCircle, ShoppingCart } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast';
import './App.css'

export default function App() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)

  // Función para cargar los productos
  const fetchProductos = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:3000/api/productos')
      setProductos(response.data)
    } catch (error) {
      console.error("Error al conectar:", error)
      toast.error("Error al cargar productos")
    } finally {
      setLoading(false)
    }
  }

  // Se ejecuta al cargar la página por primera vez
  useEffect(() => {
    fetchProductos()
  }, [])

  // LA FUNCIÓN CORREGIDA: Definida claramente aquí
  const realizarVenta = async (producto) => {
    // Verificar si hay stock
    if (producto.stock_actual <= 0) {
      toast.error("Producto sin stock disponible");
      return;
    }

    try {
      // Cambiamos 'producto_id' por 'productoId' para que coincida con tu index.js
      const response = await axios.post('http://localhost:3000/api/ventas', {
        productoId: producto.id,
        cantidad: 1,
        motivo: 'Venta desde Panel Web'
      });

      // Mostrar mensaje de éxito
      toast.success(`¡Venta de ${producto.nombre} exitosa! 🚀`);

      // Actualizamos la lista al terminar
      await fetchProductos();

      console.log("Venta exitosa", response.data);

    } catch (error) {
      console.error("Error detallado:", error.response?.data);
      toast.error(error.response?.data?.error || "No se pudo realizar la venta");
    }
  };

  return (
    <div className="app-container">
      <Toaster position="top-right" reverseOrder={false} />
      <header className="app-header content-wrapper">
        <h1 className="app-title">
          <Package color="#3498db" size={32} /> Sistema de Inventario
        </h1>
        <button onClick={() => fetchProductos()} className="btn-refresh">
          <RefreshCw size={18} className={loading ? 'spin' : ''} /> Actualizar
        </button>
      </header>

      <main className="content-wrapper">
        {loading ? (
          <p style={{ textAlign: 'center' }}>Cargando inventario...</p>
        ) : (
          <div className="product-grid">
            {productos.map((p) => (
              <div key={p.id} className={`product-card ${p.stock_actual <= 0 ? 'out-of-stock' : ''}`}>
                <div className="card-header">
                  <h3 style={{ margin: 0 }}>{p.nombre}</h3>
                  <span className="sku-badge">{p.sku}</span>
                </div>

                <hr style={{ margin: '1rem 0', opacity: 0.1 }} />

                <div className="stock-info">
                  <div>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>Disponible</p>
                    <p className="stock-number" style={{ color: p.stock_actual < 5 ? '#e74c3c' : '#27ae60' }}>
                      {p.stock_actual}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>Precio</p>
                    <p className="price-number">${p.precio_venta}</p>
                  </div>
                </div>

                {/* BOTÓN CON LLAMADA EXPLÍCITA */}
                <button
                  onClick={() => realizarVenta(p)}
                  disabled={p.stock_actual <= 0}
                  className={`btn-sell ${p.stock_actual > 0 ? 'available' : ''}`}
                >
                  <ShoppingCart size={18} />
                  {p.stock_actual <= 0 ? 'Agotado' : 'Vender 1 unidad'}
                </button>

                {p.stock_actual < 5 && p.stock_actual > 0 && (
                  <div className="alert-low-stock">
                    <AlertCircle size={16} /> ¡Últimas unidades!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}