import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  IconButton,
} from '@mui/material';
import {
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const { addToCart, getItemQuantity } = useCart();
  const navigate = useNavigate();
  const quantityInCart = getItemQuantity(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      addToCart(product, 1);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product._id);
    }
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

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.images?.[0]?.url || '/placeholder-bakery.jpg'}
          alt={product.images?.[0]?.alt || product.name}
          sx={{
            objectFit: 'cover',
            backgroundColor: '#f5f5f5',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {product.featured && (
            <Chip
              label="Featured"
              size="small"
              sx={{
                backgroundColor: '#FFD700',
                color: 'black',
                fontWeight: 'bold',
              }}
            />
          )}
          {product.stock <= 10 && product.stock > 0 && (
            <Chip
              label="Low Stock"
              size="small"
              color="warning"
            />
          )}
          {product.stock === 0 && (
            <Chip
              label="Out of Stock"
              size="small"
              color="error"
            />
          )}
        </Box>
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
          onClick={handleToggleFavorite}
        >
          {isFavorite ? (
            <Favorite color="error" />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Chip
            label={product.category}
            size="small"
            sx={{
              backgroundColor: getCategoryColor(product.category),
              color: 'white',
              fontWeight: 'bold',
              textTransform: 'capitalize',
            }}
          />
          <Typography variant="h6" color="primary" fontWeight="bold">
            {formatPrice(product.price)}
          </Typography>
        </Box>

        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 'bold',
            fontSize: '1.1rem',
            lineHeight: 1.2,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
          }}
        >
          {product.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Rating
            value={product.rating.average}
            precision={0.1}
            size="small"
            readOnly
          />
          <Typography variant="body2" color="text.secondary">
            ({product.rating.count})
          </Typography>
        </Box>

        {product.weight && (
          <Typography variant="body2" color="text.secondary">
            {product.weight.value} {product.weight.unit}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddShoppingCart />}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          sx={{
            backgroundColor: '#8B4513',
            '&:hover': {
              backgroundColor: '#A0522D',
            },
            textTransform: 'none',
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
      </CardActions>
    </Card>
  );
};

export default ProductCard;
