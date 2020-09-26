import React from 'react';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { Context } from '../../../Context';

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
    padding: 20,
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

const User = (props) => {
  const classes = styles();
  const contextState = React.useContext(Context);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [state, setState] = React.useState({
    loading: true,
    user: [],
  });

  React.useEffect(() => {
    fetchUser();
    return () => {
      closeSnackbar();
    };
    // eslint-disable-next-line
  }, []);
  React.useEffect(() => {
    document.title =
      state.user.firstName !== '' ? state.user.firstName + ' ' + state.user.lastName : 'User';
    // eslint-disable-next-line
  }, [state.user]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:8000/user/${props.match.params.id}`, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          Authorization: contextState.contextState.session,
        },
      });
      if (!response.ok) throw response;
      const data = await response.json();
      setState({ ...state, user: data.user, loading: false });
    } catch (err) {
      enqueueSnackbar('Whoops, there was an error. please try again.', {
        variant: 'error',
      });
    }
  };

  const onDelete = async () => {
    setState({ ...state, loading: true });
    try {
      const response = await fetch(`http://localhost:8000/user/${state.user.id}`, {
        method: 'DELETE',
        redirect: 'follow',
        headers: {
          Authorization: contextState.contextState.session,
        },
      });
      if (!response.ok) throw response;
      await response.json();
      props.history.push('/users');
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
            {state.user.firstName !== ''
              ? state.user.firstName + ' ' + state.user.lastName
              : 'User'}
          </Typography>
          <Box>
            <Button size="small" color="primary" disableElevation onClick={onDelete}>
              Delete
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
              <Paper className={classes.root}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography gutterBottom variant="h5" component="h2">
                    {state.user.firstName} {state.user.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {state.user.email}
                  </Typography>
                </Box>
                {/* Cart */}
                <Paper className={classes.paperInner}>
                  {state.user.cart !== '' ? (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Image</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Count</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {state.user.cart.products.map((row, index) => (
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
                              <TableCell>{row.count}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="h6" gutterBottom>
                      Cart empty!!!
                    </Typography>
                  )}
                </Paper>
                {/* Purchases */}
                <Paper className={classes.paperInner}>
                  {state.user.purchases !== '' ? (
                    state.user.purchases.carts.map((cart, index) => (
                      <Box key={index}>
                        <Typography variant="h6" gutterBottom style={{ fontWeight: 700 }}>
                          Purchase {index + 1} at {new Date(cart.date).toDateString()}
                        </Typography>
                        <TableContainer style={{ marginBottom: 20 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }}>Image</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Title</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Count</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {cart.cart.products.map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Box className={classes.media}>
                                      <img
                                        className={classes.img}
                                        src={`http:localhost:8000/${row.product.image}`}
                                        alt="some"
                                      />
                                    </Box>
                                  </TableCell>
                                  <TableCell>{row.product.title}</TableCell>
                                  <TableCell>{row.count}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="h6" gutterBottom>
                      No purchases yet from this user!!!
                    </Typography>
                  )}
                </Paper>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default User;
