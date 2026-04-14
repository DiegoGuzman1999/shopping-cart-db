import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';

function Navbar() {
  const { cart } = useCart();
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const isLogged = !!localStorage.getItem('token');

  return (
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            TiendaCO
          </Link>
          <div className="flex items-center gap-4">
            {isLogged ? (
                <button
                    onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}
                    className="text-sm text-gray-500 hover:text-gray-700">
                  Salir
                </button>
            ) : (
                <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700">
                  Ingresar
                </Link>
            )}
            <Link to="/cart" className="relative">
              <span className="text-2xl">🛒</span>
              {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {count}
              </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
  );
}

export default function App() {
  return (
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<ProductsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
        </BrowserRouter>
      </CartProvider>
  );
}
