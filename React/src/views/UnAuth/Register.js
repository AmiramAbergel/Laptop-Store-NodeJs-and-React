import React from 'react';
import { useSnackbar } from 'notistack';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Register = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = React.useState({
    loading: false,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  React.useEffect(() => {
    document.title = 'Register an account';
    // eslint-disable-next-line
  }, []);

  const onRegister = async () => {
    setState({ ...state, loading: true });
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: state.firstName,
          lastName: state.lastName,
          email: state.email,
          password: state.password,
        }),
        redirect: 'follow',
      });
      if (!response.ok) throw response;
      await response.json();
      props.history.push('/login');
      enqueueSnackbar('Registration successfull.', {
        variant: 'success',
      });
    } catch (err) {
      console.log(err);
      setState({ ...state, loading: false });
      enqueueSnackbar('Whoops, there was an error. please try again.', {
        variant: 'error',
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={state.firstName}
                onChange={(event) => setState({ ...state, firstName: event.target.value })}
                disabled={state.loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={state.lastName}
                onChange={(event) => setState({ ...state, lastName: event.target.value })}
                disabled={state.loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={state.email}
                onChange={(event) => setState({ ...state, email: event.target.value })}
                disabled={state.loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={state.password}
                onChange={(event) => setState({ ...state, password: event.target.value })}
                disabled={state.loading}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onRegister}
            disabled={
              state.firstName === '' ||
              state.lastName === '' ||
              state.email === '' ||
              state.password === '' ||
              state.loading
            }
          >
            {state.loading ? 'Loading...' : 'Register'}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link component={NavLink} to="/" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </div>
    </Container>
  );
};

export default Register;
