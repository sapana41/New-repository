const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));

const categories = ["T-Shirt", "Shoes", "Watch", "Bag", "Jeans", "Hoodie", "Cap", "Sunglasses", "Laptop", "Mobile"];
const adjectives = ["Premium", "Stylish", "Classic", "Modern", "Comfort", "Sport", "Trendy", "Original", "Pro", "Lite"];

let products = [];
for(let i=1; i<=500; i++){
  const cat = categories[i % categories.length];
  const adj = adjectives[i % adjectives.length];
  products.push({
    id: i,
    name: `${adj} ${cat} ${i}`,
    price: Math.floor(Math.random() * 5000) + 299,
    category: cat,
    desc: `High quality ${adj} ${cat} - Product ${i}. Premium material, long lasting comfort and modern design. Best for daily use.`,
    // REAL IMAGE - Ab text nahi, asli photo ayegi
    image: `https://loremflickr.com/400/400/${cat.toLowerCase()}?lock=${i}`
  });
}

app.get('/api/products', (req,res) => {
  const search = req.query.search?.toLowerCase();
  if(search){ return res.json(products.filter(p => p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search))); }
  res.json(products);
});
app.get('/api/products/:id', (req,res) => res.json(products.find(x => x.id == req.params.id)));
app.post('/api/order', (req,res) => res.json({ message: "Order Placed Successfully!", orderId: "ORD"+Date.now() }));
app.listen(3000, () => console.log('Store running on http://localhost:3000 - 500 Real Images Loaded'));