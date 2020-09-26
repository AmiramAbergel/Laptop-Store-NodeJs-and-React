import React from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { Context } from '../Context';

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `3px solid ${theme.palette.secondary.main}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
    '&:hover': {
      textDecoration: 'none',
      color: theme.palette.secondary.main,
    },
    transition: theme.transitions.create(['color', 'opacity'], {
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  MenuIcon: {
    color: theme.palette.common.white,
  },
  Menu: {},
}));

const Header = () => {
  const classes = useStyles();
  const contextState = React.useContext(Context);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    handleClose();
    localStorage.removeItem('user');
    localStorage.removeItem('session');
    localStorage.removeItem('remember');
    localStorage.removeItem('expiry');
    contextState.setContextState({
      auth: false,
      user: {},
      session: '',
    });
  };

  return (
    <AppBar position="static" color="primary" elevation={0} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h5" color="inherit" noWrap className={classes.toolbarTitle}>
          <span role="img" aria-label="plan">  ✈Laptop Land Store✈   ️  🖥️  💻   🕹️  ️📱  🔋  🔌  ⌨️  🖱️ </span>
        </Typography>
        {contextState.contextState.auth ? (
          <Hidden xsDown>
            <Box component="nav">
              <Link
                className={classes.link}
                variant="button"
                color="inherit"
                component={NavLink}
                to="/"
              >
                Home<span role="img" aria-label="plan">🏠</span>
              </Link>
              <Link
                className={classes.link}
                variant="button"
                color="inherit"
                component={NavLink}
                to="/readme"
              >
                <span role="img" aria-label="plan">  Readme👁️‍🗨️ </span>
              </Link>
              {contextState.contextState.user.isAdmin && (
                <Link
                  className={classes.link}
                  variant="button"
                  color="inherit"
                  component={NavLink}
                  to="/users"
                >

                  <span role="img" aria-label="plan">  Users👥 </span>
                </Link>
              )}
              <Link
                className={classes.link}
                variant="button"
                color="inherit"
                component={NavLink}
                to="/cart"
              >
               <span role="img" aria-label="plan"> Cart🛒 </span>
              </Link>
              <Link
                className={classes.link}
                variant="button"
                color="inherit"
                component={NavLink}
                to="/purchases"
              >
                <span role="img" aria-label="plan">  Purchases📦 </span>
              </Link>
              <Link
                className={classes.link}
                variant="button"
                color="inherit"
                onClick={onLogout}
                style={{ cursor: 'pointer' }}
              >
                <span role="img" aria-label="plan">  Logout👋 </span>
              </Link>
            </Box>
          </Hidden>
        ) : (
          <Hidden xsDown>
            <Box component="nav">
              <Link
                className={classes.link}
                variant="button"
                color="inherit"
                component={NavLink}
                to="/"
              >
               <span role="img" aria-label="plan"> Login 👨‍👩‍👧‍👦 </span>
              </Link>
              <Link
                className={classes.link}
                variant="button"
                color="inherit"
                component={NavLink}
                to="/register"
              >
               <span role="img" aria-label="plan"> Register 📝 </span>
              </Link>
              <Link
                className={classes.link}
                variant="button"
                color="inherit"
                component={NavLink}
                to="/readme"
              >
              <span role="img" aria-label="plan">  Readme 👁️‍🗨️ </span>
              </Link>
              <Link
                  className={classes.link}
                  variant="button"
                  color="inherit"
                  component={NavLink}
                  to="/contact"
              >
              <span role="img" aria-label="plan">  Contact 📧 </span>
              </Link>
            </Box>
          </Hidden>
        )}
        <Hidden smUp>
          <IconButton onClick={handleClick}>
            <MenuIcon className={classes.MenuIcon} />
          </IconButton>
        </Hidden>
        {contextState.contextState.auth ? (
          <Menu
            keepMounted
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            className={classes.Menu}
          >
            <MenuItem component={NavLink} to="/">
              Home
            </MenuItem>
            <MenuItem component={NavLink} to="/readme">
              Readme
            </MenuItem>
            {contextState.contextState.user.isAdmin && (
              <MenuItem component={NavLink} to="/users">
                Users
              </MenuItem>
            )}
            <MenuItem component={NavLink} to="/cart">
              Cart
            </MenuItem>
            <MenuItem component={NavLink} to="/purchases">
              Purchases
            </MenuItem>
            <MenuItem onClick={onLogout}>Logout</MenuItem>
          </Menu>
        ) : (
          <Menu
            keepMounted
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            className={classes.Menu}
          >
            <MenuItem component={NavLink} to="/">
              Login
            </MenuItem>
            <MenuItem component={NavLink} to="/about">
              Register
            </MenuItem>
            <MenuItem component={NavLink} to="/readme">
              Readme
            </MenuItem>
            <MenuItem component={NavLink} to="/contact">
              Contact
            </MenuItem>
          </Menu>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
