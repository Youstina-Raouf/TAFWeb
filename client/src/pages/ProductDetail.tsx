import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  IconButton,
  Chip,
  Rating,
  Divider,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add,
  Remove,
  Favorite,
  FavoriteBorder,
  Share,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const quantityInCart = product ? getItemQuantity(product._id) : 0;

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProduct(id!);
      setProduct(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity <= product.stock && newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      try {
        addToCart(product, quantity);
        setQuantity(1);
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      bakery: '#FF9800',
      cookies: '#4CAF50',
      croissants: '#FFC107',
      bread: '#8BC34A',
      pastries: '#E91E63',
    };
    return colors[category] || '#9E9E9E';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Product not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                mb: 2,
              }}
            >
              <Box
                component="img"
                src={product.images?.[selectedImage]?.url || '/placeholder-bakery.jpg'}
                alt={product.images?.[selectedImage]?.alt || product.name}
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'cover',
                  borderRadius: 1,
                }}
              />
            </Paper>

            {product.images && product.images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                {product.images.map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={image.url}
                    alt={image.alt}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: selectedImage === index ? 2 : 1,
                      borderColor: selectedImage === index ? 'primary.main' : 'divider',
                    }}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip
                label={product.category}
                sx={{
                  backgroundColor: getCategoryColor(product.category),
                  color: 'white',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                }}
              />
              {product.featured && (
                <Chip
                  label="Featured"
                  color="warning"
                  size="small"
                />
              )}
            </Box>

            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating
                value={product.rating.average}
                precision={0.1}
                readOnly
              />
              <Typography variant="body2" color="text.secondary">
                ({product.rating.count} reviews)
              </Typography>
            </Box>

            <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>
              {formatPrice(product.price)}
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              {product.description}
            </Typography>

            {product.weight && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Weight: {product.weight.value} {product.weight.unit}
              </Typography>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">Quantity:</Typography>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Remove />
                </IconButton>
                <Typography sx={{ minWidth: 40, textAlign: 'center' }}>
                  {quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <Add />
                </IconButton>
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                {product.stock} in stock
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                sx={{
                  backgroundColor: '#8B4513',
                  '&:hover': { backgroundColor: '#A0522D' },
                  flexGrow: 1,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                }}
              >
                {product.stock === 0
                  ? 'Out of Stock'
                  : quantityInCart > 0
                  ? `Add More (${quantityInCart} in cart)`
                  : 'Add to Cart'
                }
              </Button>

              <IconButton
                color={isFavorite ? 'error' : 'default'}
                onClick={handleToggleFavorite}
                size="large"
              >
                {isFavorite ? <Favorite /> : <FavoriteBorder />}
              </IconButton>

              <IconButton size="large">
                <Share />
              </IconButton>
            </Box>

            {product.stock <= 10 && product.stock > 0 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Only {product.stock} items left in stock!
              </Alert>
            )}

            {product.stock === 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                This product is currently out of stock
              </Alert>
            )}
          </Box>
        </Grid>

        {/* Product Details Tabs */}
        <Grid item xs={12}>
          <Paper>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                <Tab label="Description" />
                <Tab label="Ingredients" />
                <Tab label="Nutritional Info" />
                <Tab label="Reviews" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                {product.description}
              </Typography>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {product.ingredients && product.ingredients.length > 0 ? (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Ingredients:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {product.ingredients.map((ingredient, index) => (
                      <Chip key={index} label={ingredient} variant="outlined" />
                    ))}
                  </Box>
                  {product.allergens && product.allergens.length > 0 && (
                    <>
                      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Allergens:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {product.allergens.map((allergen, index) => (
                          <Chip key={index} label={allergen} color="warning" variant="outlined" />
                        ))}
                      </Box>
                    </>
                  )}
                </Box>
              ) : (
                <Typography color="text.secondary">No ingredients information available</Typography>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              {product.nutritionalInfo ? (
                <Grid container spacing={2}>
                  {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                    <Grid item xs={6} sm={4} key={key}>
                      <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                          {key}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="text.secondary">No nutritional information available</Typography>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Typography color="text.secondary">
                Reviews feature coming soon! Be the first to review this product.
              </Typography>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
