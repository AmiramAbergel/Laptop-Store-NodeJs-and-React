import React from 'react';
import { useSnackbar } from 'notistack';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Context } from '../../Context';

const styles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
  },
  toolbar: {
    justifyContent: 'space-between',
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[2],
    marginBottom: theme.spacing(4),
    borderRadius: 4,
  },
  root: {
    maxWidth: 345,
  },
  media: {
    height: 200,
  },
  paperInner: {
    padding: 20,
  },
}));

const Products = () => {
  const classes = styles();
  const contextState = React.useContext(Context);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [state, setState] = React.useState({
    loading: true,
    otherLoading: false,
    products: [],
  });

  React.useEffect(() => {
    document.title = 'All Products';
    fetchProducts();
    return () => {
      closeSnackbar();
    };
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/products', {
        method: 'GET',
        redirect: 'follow',
        headers: {
          Authorization: contextState.contextState.session,
        },
      });
      if (!response.ok) throw response;
      const data = await response.json();
      setState({ ...state, products: data.products, loading: false });
    } catch (err) {
      enqueueSnackbar('Whoops, there was an error. please try again.', {
        variant: 'error',
      });
    }
  };

  const onDelete = async (id) => {
    setState({ ...state, loading: true });
    try {
      const response = await fetch(`http://localhost:8000/product/${id}`, {
        method: 'DELETE',
        redirect: 'follow',
        headers: {
          Authorization: contextState.contextState.session,
        },
      });
      if (!response.ok) throw response;
      await response.json();
      setState((prevState) => {
        const productsArray = prevState.products.filter((product) => +product.id !== +id);
        return { ...state, products: productsArray, loading: false };
      });
      enqueueSnackbar('Product deleted successfully!', {
        variant: 'success',
      });
    } catch (err) {
      enqueueSnackbar('Whoops, there was an error. please try again.', {
        variant: 'error',
      });
    }
  };

  const addToCart = async (id, price) => {
    try {
      const response = await fetch('http://localhost:8000/addtocart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: contextState.contextState.session,
        },
        body: JSON.stringify({
          productId: id,
          productPrice: price,
        }),
        redirect: 'follow',
      });
      if (!response.ok) throw response;
      await response.json();
      enqueueSnackbar('Product added to cart successfully!', {
        variant: 'success',
      });
    } catch (err) {
      enqueueSnackbar('Whoops, there was an error. please try again.', {
        variant: 'error',
      });
    }
  };

  return (
    <Box className={classes.container}>
      <Container>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6">All Products</Typography>
          {contextState.contextState.user.isAdmin && (
            <Box>
              <Button
                size="small"
                color="primary"
                disableElevation
                component={NavLink}
                to="/create"
              >
                Add Product
              </Button>
            </Box>
          )}
        </Toolbar>
        {state.loading ? (
          <Box display="flex" alignItems="center" justifyContent="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {state.products.length === 0 ? (
              <Grid item xs={12}>
                <Paper className={classes.paperInner}>
                  <Typography variant="h6" gutterBottom>
                    No products!!!
                  </Typography>
                </Paper>
              </Grid>
            ) : (
              state.products.map((product, index) => (
                <Grid item key={index} xs={12} md={4}>
                  <Card className={classes.root}>
                    <CardActionArea component={NavLink} to={`/product/${product.id}`}>
                      <CardMedia
                        className={classes.media}
                        image={`http://localhost:8000/${product.image}`}
                        title="Contemplative Reptile"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {product.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                          style={{ fontWeight: 'bold' }}
                        >
                          Price: ${product.price}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          {product.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <Divider />
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        component={NavLink}
                        to={`/product/${product.id}`}
                      >
                        View
                      </Button>
                      {contextState.contextState.user.isAdmin && (
                        <Button
                          size="small"
                          color="primary"
                          component={NavLink}
                          to={{
                            pathname: '/create',
                            state: { isEditing: true, product: product },
                          }}
                        >
                          Edit
                        </Button>
                      )}
                      {contextState.contextState.user.isAdmin && (
                        <Button size="small" color="primary" onClick={() => onDelete(product.id)}>
                          Delete
                        </Button>
                      )}
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => addToCart(product.id, product.price)}
                      >
                        Add to cart
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Products;
