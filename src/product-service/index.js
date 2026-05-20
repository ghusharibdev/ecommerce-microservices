const express = require('express');
const app = express();
app.use(express.json());
let products = [{ id: 1, name: 'Laptop', price: 999 }];
app.get('/products', (req, res) => res.json(products));
app.get('/products/:id', (req, res) => {
  const p = products.find(p => p.id == req.params.id);
  p ? res.json(p) : res.status(404).json({ error: 'Not found' });
});
app.post('/products', (req, res) => {
  const { name, price } = req.body;
  const id = products.length + 1;
  const newProduct = { id, name, price };
  products.push(newProduct);
  res.status(201).json(newProduct);
});
app.get('/health', (req, res) => res.json({ status: 'ok' }));
const PORT = process.env.PORT || 3002;
if (require.main === module) app.listen(PORT, () => console.log(`Product service on ${PORT}`));
module.exports = app;
