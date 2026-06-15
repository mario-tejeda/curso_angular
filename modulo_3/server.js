const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for Angular app running on port 4200
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// In-memory array of products (Requirement 6)
let products = [
  { id: 1, name: 'Laptop Pro 15"', price: 1299.99, stock: 15, category: 'Electrónica' },
  { id: 2, name: 'Auriculares Wireless ANC', price: 199.50, stock: 42, category: 'Audio' },
  { id: 3, name: 'Teclado Mecánico RGB', price: 89.99, stock: 25, category: 'Accesorios' },
  { id: 4, name: 'Monitor 4K IPS 27"', price: 349.99, stock: 8, category: 'Electrónica' }
];

let nextId = 5;

// GET /api/products (Requirement 6)
app.get('/api/products', (req, res) => {
  console.log(`[GET] /api/products - Returning ${products.length} products`);
  res.json(products);
});

// POST /api/products (Requirement 6)
app.post('/api/products', (req, res) => {
  const { name, price, stock, category } = req.body;
  
  if (!name || price === undefined || stock === undefined || !category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: name, price, stock, category' });
  }

  const newProduct = {
    id: nextId++,
    name,
    price: Number(price),
    stock: Number(stock),
    category
  };

  products.push(newProduct);
  console.log('[POST] /api/products - Added product:', newProduct);
  
  // Return the added element (Requirement 6)
  res.status(201).json(newProduct);
});

app.listen(PORT, () => {
  console.log(`Express API running at http://localhost:${PORT}`);
});
