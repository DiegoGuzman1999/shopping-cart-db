const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/orders', require('./routes/orders'));
app.get('/health', (req, res) =>
    res.json({ service: 'orders', status: 'ok' })
);

app.listen(process.env.PORT, () => {
    console.log(`✅ Orders service corriendo en puerto ${process.env.PORT}`);
});