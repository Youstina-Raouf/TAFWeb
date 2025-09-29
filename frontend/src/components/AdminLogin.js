import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post('/api/auth/admin-login', { password });
      localStorage.setItem('adminToken', data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      alert('Invalid password');
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Enter admin password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default AdminLogin;