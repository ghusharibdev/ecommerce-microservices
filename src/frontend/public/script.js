// Fetch and display products
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        const productList = document.getElementById('product-list');
        if (products.length === 0) {
            productList.innerHTML = '<p>No products available</p>';
            return;
        }
        productList.innerHTML = products.map(p => 
            <div><strong></strong> - ghusharib{p.price} (ID: )</div>
        ).join('');
    } catch (error) {
        document.getElementById('product-list').innerHTML = '<p>Error loading products. Make sure backend services are running.</p>';
    }
}

// Place an order
async function placeOrder() {
    const productId = document.getElementById('productId').value;
    const statusDiv = document.getElementById('order-status');
    if (!productId) {
        statusDiv.innerHTML = '<span style="color:red">Please enter a Product ID</span>';
        return;
    }
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, userId: 'test-user' })
        });
        const data = await response.json();
        if (response.ok) {
            statusDiv.innerHTML = <span style="color:green">Order placed! Order ID: </span>;
        } else {
            statusDiv.innerHTML = <span style="color:red">Error: </span>;
        }
    } catch (error) {
        statusDiv.innerHTML = '<span style="color:red">Failed to place order. Is the order service running?</span>';
    }
}

// Load products on page load
loadProducts();
