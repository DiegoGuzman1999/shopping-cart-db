import { useCart } from '../context/CartContext';
import api from '../api/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleCheckout = async () => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        setLoading(true);
        try {
            const user = JSON.parse(atob(token.split('.')[1]));
            await api.post('/orders', {
                user_id: user.id,
                items: cart.map(i => ({ product_id: i.id, quantity: i.quantity })),
            });
            clearCart();
            setMessage('¡Pedido confirmado! 🎉');
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setMessage(err.response?.data?.error || 'Error al procesar el pedido');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0)
        return (
            <div className="text-center py-20">
                <p className="text-5xl mb-4">🛒</p>
                <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
                <button onClick={() => navigate('/')}
                        className="mt-4 text-indigo-600 underline">
                    Ver productos
                </button>
            </div>
        );

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tu carrito</h2>
            {message && (
                <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-700 text-sm font-medium">
                    {message}
                </div>
            )}
            <div className="space-y-3">
                {cart.map(item => (
                    <div key={item.id}
                         className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100">
                        <img src={item.image_url} alt={item.name}
                             className="w-16 h-16 object-cover rounded-xl"/>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                            <p className="text-indigo-600 font-bold">
                                ${Number(item.price).toLocaleString('es-CO')}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-7 h-7 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold">
                                −
                            </button>
                            <span className="w-6 text-center font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-7 h-7 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold">
                                +
                            </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)}
                                className="text-red-400 hover:text-red-600 ml-2">✕</button>
                    </div>
                ))}
            </div>
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Total</span>
                    <span className="text-2xl font-bold text-gray-800">
            ${total.toLocaleString('es-CO')}
          </span>
                </div>
                <button onClick={handleCheckout} disabled={loading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50">
                    {loading ? 'Procesando...' : 'Confirmar pedido'}
                </button>
            </div>
        </div>
    );
}