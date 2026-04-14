const router = require('express').Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secreto_seguro_ecommerce_2024';

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email === 'ana@demo.com' && password === '123456') {
        const token = jwt.sign(
            { id: 1, email, name: 'Ana García' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        return res.json({ token, user: { id: 1, email, name: 'Ana García' } });
    }

    res.status(401).json({ error: 'Credenciales inválidas' });
});

module.exports = router;