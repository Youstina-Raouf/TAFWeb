import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  Divider,
  Grid,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    try {
      updateQuantity(productId, newQuantity);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    navigate('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const calculateTax = () => {
    return totalPrice * 0.085; // 8.5% tax
  };

  const calculateShipping = () => {
    return totalPrice >= 50 ? 0 : 5.99;
  };

  const calculateTotal = () => {
    return totalPrice + calculateTax() + calculateShipping();
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Add some delicious baked goods to get started!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{
              backgroundColor: '#8B4513',
              '&:hover': { backgroundColor: '#A0522D' },
            }}
          >
            Start Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        Shopping Cart ({totalItems} items)
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {items.map((item) => (
              <Box key={item.product._id}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Box
                    component="img"
                    src={item.product.images?.[0]?.url || '/placeholder-bakery.jpg'}
                    alt={item.product.name}
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 1,
                      backgroundColor: '#f5f5f5',
                    }}
                  />
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      {formatPrice(item.product.price)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Remove />
                      </IconButton>
                      <TextField
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          handleQuantityChange(item.product._id, newQuantity);
                        }}
                        inputProps={{
                          min: 1,
                          max: item.product.stock,
                          style: { textAlign: 'center', width: 60 }
                        }}
                        size="small"
                        type="number"
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      Stock: {item.product.stock}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </Typography>
                    <IconButton
                      color="error"
                      onClick={() => removeFromCart(item.product._id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Box>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={clearCart}
                color="error"
              >
                Clear Cart
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Order Summary
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal ({totalItems} items)</Typography>
              <Typography>{formatPrice(totalPrice)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Tax (8.5%)</Typography>
              <Typography>{formatPrice(calculateTax())}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping</Typography>
              <Typography>
                {calculateShipping() === 0 ? 'Free' : formatPrice(calculateShipping())}
              </Typography>
            </Box>

            {totalPrice < 50 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Add {formatPrice(50 - totalPrice)} more for free shipping!
              </Alert>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {formatPrice(calculateTotal())}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCheckout}
              disabled={isProcessing}
              sx={{
                backgroundColor: '#8B4513',
                '&:hover': { backgroundColor: '#A0522D' },
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
            >
              {isProcessing ? <CircularProgress size={24} color="inherit" /> : 'Proceed to Checkout'}
            </Button>

            {!isAuthenticated && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Please log in to complete your purchase
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
