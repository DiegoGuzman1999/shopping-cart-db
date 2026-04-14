import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function LoginPage() {
    const [form, setForm] = useState({ email: 'ana@demo.com', password: '123456' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', form);
            localStorage.setItem('token', data.token);
            navigate('/');
        } catch {
            setError('Credenciales incorrectas');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Iniciar sesión
                </h1>
                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" value={form.email}
                           onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                           placeholder="Email"
                           className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400"/>
                    <input type="password" value={form.password}
                           onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                           placeholder="Contraseña"
                           className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400"/>
                    <button type="submit"
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors">
                        Entrar
                    </button>
                </form>
                <p className="text-center text-xs text-gray-400 mt-4">
                    Demo: ana@demo.com / 123456
                </p>
            </div>
        </div>
    );
}