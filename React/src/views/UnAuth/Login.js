import React from 'react';
import { useSnackbar } from 'notistack';
import { NavLink } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { Context } from '../../Context';

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = (props) => {
  const classes = useStyles();
  const contextState = React.useContext(Context);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [state, setState] = React.useState({
    loading: false,
    email: '',
    password: '',
    remember: false,
  });
  React.useEffect(() => {
    document.title = 'Login to your account';
    return () => {
      closeSnackbar();
    };
    // eslint-disable-next-line
  }, []);

  const onLogin = async () => {
    setState({ ...state, loading: true });
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: state.email,
          password: state.password,
          remember: state.remember,
        }),
        redirect: 'follow',
      });
      if (!response.ok) throw response;
      const data = await response.json();
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: data.user.id,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          isAdmin: data.user.isAdmin,
        }),
      );
      localStorage.setItem('session', data.session);
      localStorage.setItem('remember', state.remember);
      const expiry = Date.now() + 1800000;
      localStorage.setItem('expiry', expiry);
      console.log(!state.remember);
      !state.remember && props.autoLogout(1800000);
      contextState.setContextState({
        auth: true,
        user: data.user,
        session: data.session,
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
          Sign in
        </Typography>
        <Box className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={state.email}
            onChange={(event) => setState({ ...state, email: event.target.value })}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={state.password}
            onChange={(event) => setState({ ...state, password: event.target.value })}
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                value="remember"
                checked={state.remember}
                onChange={() => setState({ ...state, remember: !state.remember })}
              />
            }
            label="Remember me"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onLogin}
            disabled={state.email === '' || state.password === '' || state.loading}
          >
            {state.loading ? 'Loading...' : 'Sign In'}
          </Button>
          <Grid container justify="flex-end">
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
            <Grid item>
              <Link component={NavLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </div>
    </Container>
  );
};

export default Login;
