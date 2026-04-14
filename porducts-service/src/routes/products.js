const router = require('express').Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM products ORDER BY id ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM products WHERE id = $1', [req.params.id]
        );
        if (!rows.length)
            return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    const { name, description, price, stock, image_url } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO products (name, description, price, stock, image_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, description, price, stock, image_url]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/stock', async (req, res) => {
    const { quantity } = req.body;
    try {
        const { rows } = await pool.query(
            `UPDATE products SET stock = stock + $1
       WHERE id = $2 AND stock + $1 >= 0 RETURNING *`,
            [quantity, req.params.id]
        );
        if (!rows.length)
            return res.status(400).json({ error: 'Stock insuficiente' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;