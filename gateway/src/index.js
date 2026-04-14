require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const auth = require('./middleware/auth');
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Ruta de autenticación
app.use('/api/auth', require('./routes/auth'));

// Health check
app.get('/api/health', (req, res) => res.json({ gateway: 'ok' }));

// Proxy productos - GET público
app.get('/api/products', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/api/products': '/products' },
    on: {
        error: (err, req, res) => {
            res.status(502).json({ error: 'Products service no disponible' });
        }
    }
}));

// Proxy productos - rutas protegidas
app.use('/api/products', auth, createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/api/products': '/products' },
}));

// Proxy órdenes - protegido
app.use('/api/orders', auth, createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: { '^/api/orders': '/orders' },
}));

app.listen(3000, () => {
    console.log('✅ Gateway corriendo en puerto 3000');
});