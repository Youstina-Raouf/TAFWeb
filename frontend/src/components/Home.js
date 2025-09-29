import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const filteredProducts = category === 'All' ? products : products.filter(p => p.category === category);

  return (
    <div>
      <h1>Tino & Friends Bakery</h1>
      <select onChange={e => setCategory(e.target.value)}>
        <option value="All">All</option>
        <option value="Bread">Bread</option>
        <option value="Beverage">Beverage</option>
        <option value="Pastries">Pastries</option>
        <option value="Sandwich">Sandwich</option>
        <option value="Viennoiserie">Viennoiserie</option>
      </select>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {filteredProducts.map(product => (
          <div key={product._id}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;