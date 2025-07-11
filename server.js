const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let products = []; // تخزين مؤقت في الذاكرة (يمكن استبداله بقاعدة بيانات)

// جلب المنتجات
app.get('/api/products', (req, res) => {
  res.json(products);
});

// إضافة منتج جديد
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// حذف منتج
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'] // أضف منصاتك هنا
}));const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
});

// عند إضافة منتج جديد
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  products.push(newProduct);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'NEW_PRODUCT', product: newProduct }));
    }
  });
  res.status(201).json(newProduct);
});
