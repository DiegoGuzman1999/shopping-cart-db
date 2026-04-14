const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/products', require('./routes/products'));
app.get('/health', (req, res) =>
    res.json({ service: 'products', status: 'ok' })
);

app.listen(process.env.PORT, () => {
    console.log(`✅ Products service corriendo en puerto ${process.env.PORT}`);
});