import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
  root: {},
  media: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  img: {
    width: 300,
    height: 300,
  },
}));

const Product = (props) => {
  const classes = styles();
  const contextState = React.useContext(Context);
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = React.useState({
    loading: true,
    product: [],
  });

  React.useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, []);
  React.useEffect(() => {
    document.title = state.product.title !== '' ? state.product.title : 'Product';
    // eslint-disable-next-line
  }, [state.product]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:8000/product/${props.match.params.id}`, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          Authorization: contextState.contextState.session,
        },
      });
      if (!response.ok) throw response;
      const data = await response.json();
      setState({ ...state, product: data.product, loading: false });
    } catch (err) {
      enqueueSnackbar('Whoops, there was an error. please try again.', {
        variant: 'error',
      });
    }
  };

  const onDelete = async () => {
    setState({ ...state, loading: true });
    try {
      const response = await fetch(`http://localhost:8000/product/${state.product.id}`, {
        method: 'DELETE',
        redirect: 'follow',
        headers: {
          Authorization: contextState.contextState.session,
        },
      });
      if (!response.ok) throw response;
      await response.json();
      enqueueSnackbar('Product deleted successfully!', {
        variant: 'success',
      });
      props.history.goBack();
    } catch (err) {
      enqueueSnackbar('Whoops, there was an error. please try again.', {
        variant: 'error',
      });
    }
  };

  const addToCart = async () => {
    try {
      const response = await fetch('http://localhost:8000/addtocart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: contextState.contextState.session,
        },
        body: JSON.stringify({
          productId: state.product.id,
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
          <Typography variant="h6">
            {state.product.title !== '' ? state.product.title : 'Product'}
          </Typography>
          <Box>
            <Button size="small" color="primary" onClick={addToCart}>
              Add to cart
            </Button>
          </Box>
        </Toolbar>
        {state.loading ? (
          <Box display="flex" alignItems="center" justifyContent="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card className={classes.root}>
                <Box className={classes.media}>
                  <img
                    className={classes.img}
                    src={`http://localhost:8000/${state.product.image}`}
                    alt=""
                  />
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {state.product.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    style={{ fontWeight: 'bold' }}
                  >
                    Price: ${state.product.price}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {state.product.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  {contextState.contextState.user.isAdmin && (
                    <Button
                      size="small"
                      color="primary"
                      component={NavLink}
                      to={{
                        pathname: '/create',
                        state: { isEditing: true, product: state.product },
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  {contextState.contextState.user.isAdmin && (
                    <Button size="small" color="primary" onClick={onDelete}>
                      Delete
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Product;
