const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies
app.use(express.json());

// Proxy to product service (default port 3001)
app.use('/api/products', createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/api/products': '/products' }
}));

// Proxy to order service (default port 3002)
app.use('/api/orders', createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL || 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: { '^/api/orders': '/orders' }
}));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'Frontend is healthy' });
});

app.listen(PORT, () => {
    console.log("Frontend running on port" );
});
