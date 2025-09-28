import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { productsAPI } from '../services/api';
import ProductCard from '../components/Product/ProductCard';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<{ [key: string]: Product[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { key: 'bakery', label: 'Fresh Bakery', icon: '🥖' },
    { key: 'cookies', label: 'Cookies', icon: '🍪' },
    { key: 'croissants', label: 'Croissants', icon: '🥐' },
    { key: 'bread', label: 'Artisan Bread', icon: '🍞' },
    { key: 'pastries', label: 'Pastries', icon: '🧁' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featuredResponse, ...categoryResponses] = await Promise.all([
          productsAPI.getFeaturedProducts(6),
          ...categories.map(cat => productsAPI.getProductsByCategory(cat.key, 4)),
        ]);

        setFeaturedProducts(featuredResponse.data);
        
        const categoryData: { [key: string]: Product[] } = {};
        categories.forEach((cat, index) => {
          categoryData[cat.key] = categoryResponses[index].data;
        });
        setCategoryProducts(categoryData);
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
          color: 'white',
          py: 12,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to Sweet Dreams Bakery
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Fresh baked goods made with love and the finest ingredients
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{
              backgroundColor: 'white',
              color: '#8B4513',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            Shop Now
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Featured Products */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
              Featured Products
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/products?featured=true')}
              sx={{ textTransform: 'none' }}
            >
              View All
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Categories */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
            Shop by Category
          </Typography>
          
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.key}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.shadows[8],
                    },
                  }}
                  onClick={() => navigate(`/products?category=${category.key}`)}
                >
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {category.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {category.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {categoryProducts[category.key]?.length || 0} products available
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: '#8B4513',
                      '&:hover': { backgroundColor: '#A0522D' },
                      textTransform: 'none',
                    }}
                  >
                    Browse
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Category Products Preview */}
        {categories.map((category) => {
          const products = categoryProducts[category.key];
          if (!products || products.length === 0) return null;

          return (
            <Box key={category.key} sx={{ mb: 8 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                  {category.icon} {category.label}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/products?category=${category.key}`)}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={product._id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          );
        })}

        {/* Call to Action */}
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready to Order?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Browse our full selection of fresh baked goods and place your order today!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{
              backgroundColor: '#8B4513',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#A0522D' },
            }}
          >
            Start Shopping
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
