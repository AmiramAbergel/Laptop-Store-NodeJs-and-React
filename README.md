# Laptop-Store-NodeJs-and-React



School project for Mobile Applications course


> 

---

### Table of Contents

- [Description](#description)
- [How To Use](#how-to-use)
- [References](#references)

- [Author Info](#author-info)

---

## Description



#### Specific Details


```html
    import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles({
  root: {
    paddingTop: 50,
  },
  paper: {
    padding: 20,
  },
});

const Readme = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Container>
        <Paper className={classes.paper}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h3" gutterBottom>
              Laptop Land Store
            </Typography>
          </Box>
          <Divider />
          <Typography variant="h5" gutterBottom style={{ marginTop: 20 }}>
            <span role="img" aria-label="1"> 🧮🧮🧮🧮🧮🧮🧮🧮🧮🧮🧮Welcome to the Laptop Land online store🧮🧮🧮🧮🧮🧮🧮🧮🧮🧮🧮</span>.<br/>
            Laptop Land provides the largest range and quantity of quality Laptop, Tablets and Computer equipment.<br/>
            <Divider /><Divider /><Divider /><Divider /><Divider /><Divider /><Divider /><Divider /><Divider /><Divider
          /><Divider /><Divider /><Divider /><Divider /><Divider /><Divider /><Divider /><Divider /><Divider />
          <Divider /><Divider /><Divider /><Divider /><Divider /><Divider /><Divider /><Divider /><Divider /><Divider />
          <Divider /><Divider /><Divider /><Divider /><Divider /><Divider /><Divider /><Divider /><Divider /><Divider />
            <span role="img" aria-label="2">🖥</span>What are you selling?
          </Typography>
          <Typography variant="body1" gutterBottom>
            In our store we sell Laptop, Tablets and Computer equipments.
          </Typography>
          <Typography variant="h5" gutterBottom style={{ marginTop: 20 }}>
            <span role="img" aria-label="2">🖥</span>What additional page(s) did you add? How to operate them
          </Typography>
          <Typography variant="body1" gutterBottom>
            <p>We added Contact form option when you just enter the site, our customers very important for us. :) <br/>
              We added few pages inside the checkout page. all of them continue each other, you have 3 stages:<br/>
              1. Shipping Address<br/>
              2. Payment Details<br/>
              3. Order summary<br/>
              Thank you for your purchase banner :).<br/>
              We also added the "Edit" option to Admin User and the status of each user in the system include
              the date of the orders he did in the past.</p>
          </Typography>
          <Typography variant="h5" gutterBottom style={{ marginTop: 20 }}>
            <span role="img" aria-label="2">🖥</span>Who is your partner? (name) and (id) What did you do? What did your partner do?
          </Typography>
          <Typography variant="body1" gutterBottom>
            Uriel Sabah - 200629020; <br/>
            I did the basic framework.. the Cart, Checkout, Login and Register files,
            (and their functions in server and repository) and took care of the tests and general style.
             <br/>
            Uriel did the App, Admin Screen (and reading/writing from/to file),
            Products, Product, TextInput files, and their respective functions in the server and repository files.
            Also did Purchases.
          </Typography>
          <Typography variant="h5" gutterBottom style={{ marginTop: 20 }}>
            <span role="img" aria-label="2">🖥</span> Specify all the different route your app support
          </Typography>
          <Typography variant="body1" gutterBottom>
            <span role="img" aria-label="3">👉 👉 👉 👉 All of different route our app support we can check in route.js file👈👈👈👈</span><br/>
            <span role="img" aria-label="box"> 📦 </span>Get cart : All products that were added to cart.<br/>
            <span role="img" aria-label="box"> 📦 </span>Checkout : Shows the list of products you chose and allows you to buy them. <br/>
            <span role="img" aria-label="box"> 📦 </span>Add to cart : Allows you to Add and order some product you interested of that our store offers,
            everything will be stored in your personal cart.<br/>
            <span role="img" aria-label="box"> 📦 </span>View product : Shows you specific product that you interested in, include name, price, and little description. <br/>
            <span role="img" aria-label="box"> 📦 </span>Add + Edit Product (Admin only) : Allows you to fill a form of any new product you want to add to the store,
            including uploading an image option, <br/>and add price/description boxes to fill.
            (Edit option will take you back to the form that you already made and will give you the option to change whatever you want).<br/>
            <span role="img" aria-label="box"> 📦 </span>Users (Admin only) : Exposes the activity of any other users,
            including filtering by date purchase, cart current status, and view/delete existing users option. <br/>
            <span role="img" aria-label="box"> 📦 </span>Login : The login page. includes a 'Remember me' option to make the cookie never expire. <br/>
            <span role="img" aria-label="box"> 📦 </span>Registration : A sign up page to create a new user.<br/>
          </Typography>
          <Typography variant="h5" gutterBottom style={{ marginTop: 20 }}>
            <span role="img" aria-label="2">🖥</span>How did you make your store secured?
          </Typography>
          <Typography variant="body1" gutterBottom>
            We used cookie session to keep the user as long as he wants and every request to the
            server is being protected by the cookie server token. There is a secret key used in each
            request to validate it. Only authorized users can access the system. There are other
            security measures taken both in front end and back end to ensure the security. Only
            logged in users can send request.
          </Typography>
          <Typography variant="h5" gutterBottom style={{ marginTop: 20 }}>
            <span role="img" aria-label="2">🖥</span>What was hard to do?
          </Typography>
          <Typography variant="body1" gutterBottom>
            <p>Since this is my first time working in React and I didn't know it at all before,
              it took a while to learn and understand how to work with it. <br/>
              After I got the hang of React, everything went quite smoothly.</p>
          </Typography>

          <Typography variant="h5" gutterBottom style={{ marginTop: 20 }}>
            <span role="img" aria-label="2">🖥</span>Did you implement the store using react.js?
          </Typography>
          <Typography variant="body1" gutterBottom>
            Yes we did<span role="img" aria-label="5"> 🥳 </span>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Readme;

```

---
#### Technologies

-

[Back To The Top](#E_commerce_catalog_php)

---

## How To Use

#### Installation



[Back To The Top](#E_commerce_catalog_php)

---


## Author Info

- Linkedin - [@AmiramAbergel](https://www.linkedin.com/in/amiram-abergel/)

[Back To The Top](#E_commerce_catalog_php)

---

Thank You.
