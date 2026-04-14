import { useEffect, useState } from 'react';
import api from '../api/client';
import { useCart } from '../context/CartContext';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, cart } = useCart();

    useEffect(() => {
        api.get('/products').then(r => {
            setProducts(r.data);
            setLoading(false);
        });
    }, []);

    const getQtyInCart = (id) => cart.find(i => i.id === id)?.quantity || 0;

    if (loading)
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"/>
            </div>
        );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => (
                <div key={p.id}
                     className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <img src={p.image_url} alt={p.name} className="w-full h-44 object-cover"/>
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-1">{p.name}</h3>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{p.description}</p>
                        <div className="flex items-center justify-between">
              <span className="text-indigo-600 font-bold text-lg">
                ${Number(p.price).toLocaleString('es-CO')}
              </span>
                            <span className="text-xs text-gray-400">Stock: {p.stock}</span>
                        </div>
                        <button onClick={() => addToCart(p)} disabled={p.stock === 0}
                                className="mt-3 w-full py-2 rounded-xl text-sm font-medium transition-colors
                bg-indigo-600 hover:bg-indigo-700 text-white
                disabled:bg-gray-200 disabled:text-gray-400">
                            {getQtyInCart(p.id) > 0
                                ? `En carrito (${getQtyInCart(p.id)})`
                                : 'Agregar al carrito'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}