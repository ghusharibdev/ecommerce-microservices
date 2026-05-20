const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
let orders = [];
app.post('/orders', async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) return res.status(400).json({ error: 'Missing fields' });
  try {
    await axios.get(`${PRODUCT_SERVICE_URL}/products/${productId}`);
  } catch {
    return res.status(404).json({ error: 'Product not found' });
  }
  const id = orders.length + 1;
  const order = { id, userId, productId, status: 'created' };
  orders.push(order);
  res.status(201).json(order);
});
app.get('/orders/:userId', (req, res) => {
  res.json(orders.filter(o => o.userId == req.params.userId));
});
app.get('/health', (req, res) => res.json({ status: 'ok' }));
const PORT = process.env.PORT || 3003;
if (require.main === module) app.listen(PORT, () => console.log(`Order service on ${PORT}`));
module.exports = app;
