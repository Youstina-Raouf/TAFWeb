import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Orders</h2>
      <ul>
        {orders.map(order => (
          <li key={order._id}>
            Order by {order.user.email} - Total: ${order.total}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;