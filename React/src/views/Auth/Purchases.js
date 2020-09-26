import React from 'react';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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
  media: {
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  img: {
    height: 50,
  },
  paperInner: {
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  },
}));

const Purchases = (props) => {
  const classes = styles();
  const contextState = React.useContext(Context);
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = React.useState({
    loading: true,
    purchases: '',
  });

  React.useEffect(() => {
    document.title = 'Your Purchases';
    fetchPurchases();
    // eslint-disable-next-line
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await fetch(`http://localhost:8000/purchases`, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          Authorization: contextState.contextState.session,
        },
      });
      if (!response.ok) throw response;
      const data = await response.json();
      setState({ ...state, purchases: data.purchase, loading: false });
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
          <Typography variant="h6">Your Purchase History</Typography>
        </Toolbar>
        {state.loading ? (
          <Box display="flex" alignItems="center" justifyContent="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        ) : (
          <Paper className={classes.paperInner}>
            {state.purchases !== '' ? (
              state.purchases.carts
                .slice(0)
                .reverse()
                .map((cart, index) => (
                  <Box key={index}>
                    <Typography
                      variant="h6"
                      color="secondary"
                      gutterBottom
                      style={{ fontWeight: 700 }}
                    >
                      Purchase {index + 1} at {new Date(cart.date).toLocaleString()}
                    </Typography>
                    <TableContainer style={{ marginBottom: 20 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Image</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Count</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {cart.cart.products.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Box className={classes.media}>
                                  <img
                                    className={classes.img}
                                    src={`http://localhost:8000/${row.product.image}`}
                                    alt=""
                                  />
                                </Box>
                              </TableCell>
                              <TableCell>{row.product.title}</TableCell>
                              <TableCell>
                                {row.count} x ${row.product.price}
                              </TableCell>
                              <TableCell>${row.product.price * row.count}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell>
                              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                Total
                              </Typography>
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                ${cart.cart.totalPrice}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ))
            ) : (
              <Typography variant="h6" gutterBottom>
                No purchases yet!!!
              </Typography>
            )}
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default Purchases;
