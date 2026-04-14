const router = require('express').Router();
const pool = require('../db');
const axios = require('axios');

const PRODUCTS_URL = process.env.PRODUCTS_SERVICE_URL;

router.post('/', async (req, res) => {
    const { user_id, items } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let total = 0;
        const enrichedItems = [];

        for (const item of items) {
            const { data: product } = await axios.get(
                `${PRODUCTS_URL}/products/${item.product_id}`
            );
            if (product.stock < item.quantity)
                throw new Error(`Stock insuficiente para: ${product.name}`);
            total += product.price * item.quantity;
            enrichedItems.push({ ...item, unit_price: product.price });
        }

        const { rows: [order] } = await client.query(
            `INSERT INTO orders (user_id, status, total)
       VALUES ($1, 'confirmed', $2) RETURNING *`,
            [user_id, total]
        );

        for (const item of enrichedItems) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
                [order.id, item.product_id, item.quantity, item.unit_price]
            );
            await axios.patch(
                `${PRODUCTS_URL}/products/${item.product_id}/stock`,
                { quantity: -item.quantity }
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ order, items: enrichedItems });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT o.*, json_agg(
         json_build_object(
           'product_id', oi.product_id,
           'quantity', oi.quantity,
           'unit_price', oi.unit_price
         )
       ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
            [req.params.userId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;