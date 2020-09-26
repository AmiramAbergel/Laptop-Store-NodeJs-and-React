import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Context } from '../Context';
import Header from '../components/Header';

// UnAuth
import Login from '../views/UnAuth/Login';
import Register from '../views/UnAuth/Register';
import Readme from '../views/Readme';
import Contact from "../views/Contact";

// Auth
import Products from '../views/Auth/Products';
import Product from '../views/Auth/Product';
import Cart from '../views/Auth/Cart';
import Checkout from '../views/Auth/Checkout';
import Purchases from '../views/Auth/Purchases';

// Admin
import AddProduct from '../views/Auth/Admin/AddProduct';
import Users from '../views/Auth/Admin/Users';
import User from '../views/Auth/Admin/User';

const Store = () => {
  const [state, setState] = React.useState({
    loading: true,
    contextState: {
      auth: false,
      user: {},
      session: '',
    },
  });

  React.useEffect(() => {
    const user = localStorage.getItem('user');
    const session = localStorage.getItem('session');
    let remember = localStorage.getItem('remember');
    const expiry = localStorage.getItem('expiry');
    remember = remember === 'true' ? true : false;
    if (!user || !session || !expiry) {
      setState({ ...state, loading: false });
      localStorage.removeItem('user');
      localStorage.removeItem('session');
      localStorage.removeItem('remember');
      localStorage.removeItem('expiry');
    } else if (new Date(+expiry) <= new Date() && !remember) {
      setState({
        ...state,
        contextState: { ...state.contextState, auth: false, user: {}, session: '' },
      });
      localStorage.removeItem('user');
      localStorage.removeItem('session');
      localStorage.removeItem('remember');
      localStorage.removeItem('expiry');
      setState({ ...state, loading: false });
      return;
    } else if (new Date(+expiry) > new Date() && !remember) {
      setState({
        ...state,
        loading: false,
        contextState: {
          ...state.contextState,
          auth: true,
          user: JSON.parse(user),
          session: session,
        },
      });
      const newExpiry = new Date(+expiry) - new Date();
      autoLogout(newExpiry);
    } else {
      setState({
        ...state,
        loading: false,
        contextState: {
          ...state.contextState,
          auth: true,
          user: JSON.parse(user),
          session: session,
        },
      });
    }
    // eslint-disable-next-line
  }, []);

  const changeContext = (state) => {
    setState({ ...state, contextState: { ...state.contextState, ...state } });
  };

  const autoLogout = (time) => {
    setTimeout(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('session');
      localStorage.removeItem('remember');
      localStorage.removeItem('expiry');
      setState({
        ...state,
        loading: false,
        contextState: { ...state.contextState, auth: false, user: {}, session: '' },
      });
    }, time);
  };

  return (
    <React.Fragment>
      <Context.Provider
        value={{ contextState: state.contextState, setContextState: changeContext }}
      >
        <>
          <Header />
          {state.loading ? (
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="60vh">
              <CircularProgress />
            </Box>
          ) : state.contextState.auth ? (
            <Switch>
              <Route exact path="/" component={Products} />
              <Route exact path="/product/:id" component={Product} />
              <Route exact path="/cart" component={Cart} />
              <Route exact path="/checkout" component={Checkout} />
              <Route exact path="/purchases" component={Purchases} />
              <Route exact path="/readme" component={Readme} />
              {state.contextState.user.isAdmin && (
                <Route exact path="/create" component={AddProduct} />
              )}
              {state.contextState.user.isAdmin && <Route exact path="/users" component={Users} />}
              {state.contextState.user.isAdmin && <Route exact path="/user/:id" component={User} />}
              <Redirect from="*" to="/" />
            </Switch>
          ) : (
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => <Login autoLogout={autoLogout} {...props} />}
              ></Route>
              <Route exact path="/register" component={Register} />
              <Route exact path="/readme" component={Readme} />
              <Route exact path="/contact" component={Contact} />
              <Redirect from="*" to="/" />
            </Switch>
          )}
        </>
      </Context.Provider>
    </React.Fragment>
  );
};

export default Store;
