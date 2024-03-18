import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Product.css';

const OrderManagement = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: ''
  });
  const[add, setAdd] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:8080/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products: ', error);
      });

    axios.get('http://localhost:8080/orders')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders: ', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleOrderSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('http://localhost:8080/orders', {
        product: selectedProduct,
        quantity: quantity
      });

      const response = await axios.get('http://localhost:8080/orders');
      setOrders(response.data);

      console.log('Order placed successfully');
    } catch (error) {
      console.error('Error placing order: ', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8080/order/delete/${orderId}`);

 
      const response = await axios.get('http://localhost:8080/orders');
      setOrders(response.data);

      console.log('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order: ', error);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {

      await axios.post('http://localhost:8080/products', newProduct);
      setNewProduct({
        name: '',
        price: ''
      });

      const response = await axios.get('http://localhost:8080/products');
      setProducts(response.data);
      setAdd(!add)
    } catch (error) {
      console.error('Error adding product: ', error);
    }
  };

  return (
    <div style={{display:"flex"}}>
        <div style={{margin:"5rem"}}>
        <h2>Add New Product {add && <button onClick={()=>setAdd(!add)}>+</button>}</h2>
       {add ? (null) :(<form onSubmit={handleProductSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} />
        </label>
        <label>
          Price:
          <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} />
        </label>
        <button type="submit">Add Product</button>
      </form>)}
      <h2>Product List</h2>
      <ul>
        {products.map(product => (
            <>
          <li key={product._id}>
            {product.name} - ${product.price}
          </li>
          <button onClick={() => setSelectedProduct(product._id)}>Select</button>
          </>
        ))}
      </ul>
      </div>
    <div style={{margin:"5rem"}}>
      <h2>Place Order</h2>
      <form onSubmit={handleOrderSubmit}>
        <label>
          Quantity:
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </label>
        <button type="submit" disabled={!selectedProduct}>Place Order</button>
      </form>

      <h2>Order List</h2>
      <ul>
        {orders.map(order => (
            <>
          <li key={order._id}>
            Product ID: {order.product.name} - Quantity: {order.quantity}
          </li>
          <button onClick={() => handleDeleteOrder(order._id)}>Delete</button>
          </>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default OrderManagement;
