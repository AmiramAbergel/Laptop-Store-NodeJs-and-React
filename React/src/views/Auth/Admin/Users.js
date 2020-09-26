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
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
  root: {},
  paperInner: {
    padding: 20,
  },
}));

const Users = (props) => {
  const classes = styles();
  const contextState = React.useContext(Context);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [state, setState] = React.useState({
    loading: true,
    users: [],
  });

  React.useEffect(() => {
    document.title = 'All users';
    fetchUsers();
    return () => {
      closeSnackbar();
    };
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/users', {
        method: 'GET',
        redirect: 'follow',
        headers: {
          Authorization: contextState.contextState.session,
        },
      });
      if (!response.ok) throw response;
      const data = await response.json();
      setState({ ...state, users: data.users, loading: false });
    } catch (err) {
      enqueueSnackbar('Whoops, there was an error. please try again.', {
        variant: 'error',
      });
    }
  };

  const onDelete = async (id) => {
    setState({ ...state, loading: true });
    try {
      const response = await fetch(`http://localhost:8000/user/${id}`, {
        method: 'DELETE',
        redirect: 'follow',
        headers: {
          Authorization: contextState.contextState.session,
        },
      });
      if (!response.ok) throw response;
      await response.json();
      setState((prevState) => {
        const usersArray = prevState.users.filter((user) => String(user.id) !== String(id));
        return { ...state, users: usersArray, loading: false };
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
          <Typography variant="h6">All users</Typography>
        </Toolbar>
        {state.loading ? (
          <Box display="flex" alignItems="center" justifyContent="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {state.users.length === 1 ? (
              <Grid item xs={12}>
                <Paper className={classes.paperInner}>
                  <Typography variant="h6" gutterBottom>
                    No Users!!!
                  </Typography>
                </Paper>
              </Grid>
            ) : (
              state.users.map((user, index) => {
                if (user.isAdmin) return <Grid item xs={false} key={index}></Grid>;
                return (
                  <Grid key={index} item xs={12} md={4}>
                    <Card className={classes.root}>
                      <CardActionArea component={NavLink} to={`/user/${user.id}`}>
                        <CardContent>
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Typography gutterBottom variant="h5" component="h2">
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                              {user.email}
                            </Typography>
                          </Box>
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell style={{ fontWeight: 'bold' }}>
                                    Total Purchases
                                  </TableCell>
                                  <TableCell style={{ fontWeight: 'bold' }}>
                                    In cart Items
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>{user.purchases}</TableCell>
                                  <TableCell>{user.cart}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </CardContent>
                      </CardActionArea>
                      <CardActions>
                        <Button
                          size="small"
                          color="primary"
                          component={NavLink}
                          to={`/user/${user.id}`}
                        >
                          View
                        </Button>
                        <Button size="small" color="primary" onClick={() => onDelete(user.id)}>
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Users;
