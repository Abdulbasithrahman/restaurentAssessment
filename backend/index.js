const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1/my_database').then(() => {
  console.log('MongoDB connected');
}).catch(err => console.log(err));

const productSchema = new mongoose.Schema({
  name: String,
  price: Number
});
const Product = mongoose.model('Product', productSchema);

const orderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number
});
const Order = mongoose.model('Order', orderSchema);

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/products', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price
  });
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/orders', async (req, res) => {
  const order = new Order({
    product: req.body.product,
    quantity: req.body.quantity
  });
  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/order/delete/:id',async(req,res)=>{
    try {
         const deletedOrder = await Order.findByIdAndDelete(req.params.id)
         if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
          }
          res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({mes:error})
    }
})

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
