const client = require('./redisConnector');

//  Using ioredis and with Async/Await
// Users
// Registration
exports.register = async (req, res, next) => {
  let id = req.body.email.split('@')[0].replace(/. _/g, '');
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let password = req.body.password;
  try {
    const users = await client.lrange('users', 0, -1);
    const isUser = users.some((user) => {
      return JSON.parse(user).id === id;
    });
    if (isUser) {
      const err = new Error('User already exists!!');
      err.status = 404;
      throw err;
    }
    const reply = await client.rpush(
      'users',
      JSON.stringify({
        id: id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        isAdmin:false,
      }),
    );
    res.status(201).json({ user: reply });
  } catch (err) {
    next(err);
  }
};
// Login
exports.login = async (req, res, next) => {
  let id = req.body.email.split('@')[0].replace(/. _/g, '');
  let password = req.body.password;
  let remember = req.body.remember;
  try {
    const users = await client.lrange('users', 0, -1);
    let user = users.filter((user) => {
      return JSON.parse(user).id === id;
    });
    if (user.length < 1) {
      const err = new Error('Whoops, No user found with this email!');
      err.status = 404;
      throw err;
    }
    user = JSON.parse(user);
    if (user.password !== password) {
      const err = new Error('Whoops, Password in incorrect!');
      err.status = 404;
      throw err;
    }
    let cookieSession = 'somethingverysecure' + id + 'making';
    await client.hmset('tokens.' + id, ['token', cookieSession]);
    if (!remember) {
      client.expire('tokens.' + id, 1800);
    }
    res.status(200).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      session: cookieSession,
    });
  } catch (err) {
    next(err);
  }
};
// Get all users
exports.allUsers = async (req, res, next) => {
  try {
    const users = await client.lrange('users', 0, -1);
    const usersArray = [];
    await Promise.all(
      users.map(async (user) => {
        // Get all Purchases
        const purchases = await client.lrange('purchases', 0, -1);
        // Find Purchase
        let purchase = purchases.filter((purchase) => {
          return JSON.parse(purchase).id === JSON.parse(user).id;
        });
        // Get all carts
        const carts = await client.lrange('carts', 0, -1);
        // Find cart
        let cart = carts.filter((cart) => {
          return JSON.parse(cart).id === JSON.parse(user).id;
        });
        usersArray.push({
          ...JSON.parse(user),
          purchases: purchase.length > 0 ? JSON.parse(purchase).carts.length : 0,
          cart: cart.length > 0 ? JSON.parse(cart).products.length : 0,
        });
      }),
    );
    res.status(200).json({
      users: usersArray,
    });
  } catch (err) {
    next(err);
  }
};
// Get user
exports.searchUser = async (req, res, next) => {
  let id = req.params.id;
  try {
    const users = await client.lrange('users', 0, -1);
    let user = users.filter((user) => {
      return JSON.parse(user).id === id;
    });
    // Get all Purchases
    const purchases = await client.lrange('purchases', 0, -1);
    // Find Purchase
    let purchase = purchases.filter((purchase) => {
      return JSON.parse(purchase).id === id;
    });
    let purchases2 = '';
    if (purchase.length < 1) {
      purchases2 = '';
    } else {
      // Purchase found
      purchases2 = JSON.parse(purchase);
    }
    // Get all carts
    const carts = await client.lrange('carts', 0, -1);
    // Find cart
    let cart = carts.filter((cart) => {
      return JSON.parse(cart).id === id;
    });
    let cart2 = '';
    if (cart.length < 1) {
      // No cart found
      cart2 = '';
    } else {
      // Cart found
      const cartParsed = JSON.parse(cart);
      let fullCart = cartParsed;
      const products = await client.lrange('products', 0, -1);
      cartParsed.products.map((productCart, index) => {
        let product = products.filter((product) => {
          return JSON.parse(product).id === +productCart.id;
        });
        if (product.length < 1) {
          fullCart.products[index].product = '';
        } else {
          fullCart.products[index].product = JSON.parse(product[0]);
        }
      });
      cart2 = fullCart;
    }
    res.status(200).json({
      user: {
        ...JSON.parse(user),
        purchases: purchases2,
        cart: cart2,
      },
    });
  } catch (err) {
    next(err);
  }
};
// Delete user
exports.deleteUser = async (req, res, next) => {
  let id = req.params.id;
  try {
    const users = await client.lrange('users', 0, -1);
    let user = users.filter((user) => {
      return JSON.parse(user).id === id;
    });
    if (user.length < 1) {
      const err = new Error('Whoops, No user found to delete!');
      err.status = 404;
      throw err;
    }
    const reply = await client.lrem('users', 1, user[0]);
    if (reply !== 1) {
      const err = new Error('Whoops, there was something wrong! Try again.');
      err.status = 404;
      throw err;
    }
    await client.hdel('tokens.' + id, 'token');
    // No need to handle TOKEN DEL error
    res.status(201).json({
      message: 'User removed',
      user: JSON.parse(user),
    });
  } catch (err) {
    next(err);
  }
};

// ============= Products =============
// Get all products
exports.allProducts = async (req, res, next) => {
  try {
    const products = await client.lrange('products', 0, -1);
    const productsArray = [];
    products.map((product) => productsArray.push(JSON.parse(product)));
    res.status(200).json({
      products: productsArray,
    });
  } catch (err) {
    next(err);
  }
};
// Create Product
exports.createProduct = async (req, res, next) => {
  let id = Date.now();
  let userId = req.userId;
  let title = req.body.title;
  let description = req.body.description;
  let price = req.body.price;
  let imagePath = req.file.path;
  imagePath = imagePath.replace(/\\/g, '/');
  try {
    const products = await client.lrange('products', 0, -1);
    const isProduct = products.some((product) => {
      return JSON.parse(product).title === title;
    });
    if (isProduct) {
      const err = new Error('Product already exists!');
      err.status = 404;
      throw err;
    }
    const reply = await client.rpush(
      'products',
      JSON.stringify({
        id: id,
        userId: userId,
        title: title,
        description: description,
        price: price,
        image: imagePath,
      }),
    );
    res.status(201).json({ product: reply });
  } catch (err) {
    next(err);
  }
};
// Get product
exports.getProduct = async (req, res, next) => {
  let id = req.params.id;
  try {
    const products = await client.lrange('products', 0, -1);
    let product = products.filter((product) => {
      return JSON.parse(product).id === +id;
    });
    if (product.length < 1) {
      const err = new Error('Whoops, No product found!');
      err.status = 404;
      throw err;
    }
    res.status(200).json({
      product: JSON.parse(product[0]),
    });
  } catch (err) {
    next(err);
  }
};
// Edit product
exports.editProduct = async (req, res, next) => {
  let id = req.params.id;
  let userId = req.userId;
  let title = req.body.title;
  let description = req.body.description;
  let price = req.body.price;
  let imagePath = '';
  if (req.file) {
    imagePath = req.file.path;
    imagePath = imagePath.replace(/\\/g, '/');
  }
  try {
    const products = await client.lrange('products', 0, -1);
    let product = products.filter((product) => {
      return JSON.parse(product).id === +id;
    });
    if (product.length < 1) {
      const err = new Error('Whoops, No product found!');
      err.status = 404;
      throw err;
    }
    const parsedProduct = JSON.parse(product[0]);
    if (parsedProduct.userId !== userId) {
      const err = new Error('Not authorized for this action!');
      err.status = 404;
      throw err;
    }
    const reply = await client.lrem('products', 1, product[0]);
    if (reply !== 1) {
      const err = new Error('Whoops, there was something wrong!');
      err.status = 404;
      throw err;
    }
    const reply1 = await client.rpush(
      'products',
      JSON.stringify({
        id: parsedProduct.id,
        userId: parsedProduct.userId,
        title: title,
        description: description,
        price: price,
        image: imagePath === '' ? parsedProduct.image : imagePath,
      }),
    );
    res.status(200).json({
      message: 'Product updated',
      product: reply1,
    });
  } catch (err) {
    next(err);
  }
};
// Delete product
exports.deleteProduct = async (req, res, next) => {
  let id = req.params.id;
  try {
    const products = await client.lrange('products', 0, -1);
    let product = products.filter((product) => {
      return JSON.parse(product).id === +id;
    });
    if (product.length < 1) {
      const err = new Error('Whoops, No product found!');
      err.status = 404;
      throw err;
    }
    const reply = await client.lrem('products', 1, product[0]);
    if (reply !== 1) {
      const err = new Error('Whoops, there was something wrong!');
      err.status = 404;
      throw err;
    }
    res.status(200).json({
      message: 'Product removed',
      product: JSON.parse(product[0]),
    });
  } catch (err) {
    next(err);
  }
};

// Cart
// Add product to cart / create cart
exports.addToCart = async (req, res, next) => {
  const productId = req.body.productId;
  const productPrice = req.body.productPrice;
  let userId = req.userId;
  try {
    const carts = await client.lrange('carts', 0, -1);
    let cart = carts.filter((cart) => JSON.parse(cart).id === userId);
    if (cart.length < 1) {
      // No cart found
      const reply = await client.rpush(
        'carts',
        JSON.stringify({
          id: userId,
          totalPrice: +productPrice,
          products: [
            {
              id: productId,
              count: 1,
            },
          ],
        }),
      );
      res.status(201).json({ cart: reply });
    } else {
      // Cart found
      let cartParsed = JSON.parse(cart);
      let found = false;
      cartParsed.products.map((product, index) => {
        if (+product.id === +productId) {
          // Product found , increase count
          cartParsed.products[index].count += 1;
          found = true;
        }
      });
      if (!found) {
        // Product not found, add its entry
        cartParsed.products.push({
          id: productId,
          count: 1,
        });
      }
      cartParsed.totalPrice = +cartParsed.totalPrice + +productPrice;
      // Removing existing cart
      const reply = await client.lrem('carts', 1, cart[0]);
      if (reply !== 1) {
        const err = new Error('Oh no, there was something wrong!');
        err.status = 404;
        throw err;
      }
      // Adding updated cart
      const reply2 = await client.rpush('carts', JSON.stringify(cartParsed));
      res.status(201).json({ cart: reply2 });
    }
  } catch (err) {
    next(err);
  }
};
// Get Cart
exports.getCart = async (req, res, next) => {
  let userId = req.userId;
  try {
    // Get all carts
    const carts = await client.lrange('carts', 0, -1);
    // Find cart
    let cart = carts.filter((cart) => {
      return JSON.parse(cart).id === userId;
    });
    if (cart.length < 1) {
      // No cart found
      res.status(200).json({ cart: '' });
    } else {
      // Cart found
      const cartParsed = JSON.parse(cart);
      let fullCart = cartParsed;
      const products = await client.lrange('products', 0, -1);
      cartParsed.products.map((productCart, index) => {
        let product = products.filter((product) => {
          return JSON.parse(product).id === +productCart.id;
        });
        if (product.length < 1) {
          fullCart.products[index].product = '';
        } else {
          fullCart.products[index].product = JSON.parse(product[0]);
        }
      });
      res.status(200).json({ cart: fullCart });
    }
  } catch (err) {
    next(err);
  }
};

// Purchases
// Make purchase
exports.purchase = async (req, res, next) => {
  let userId = req.userId;
  try {
    // Get all carts
    const carts = await client.lrange('carts', 0, -1);
    // Find cart
    let cart = carts.filter((cart) => {
      return JSON.parse(cart).id === userId;
    });
    if (cart.length < 1) {
      // No cart found
      const err = new Error('Cannot make an empty purchase!');
      err.status = 404;
      throw err;
    }
    // Cart found
    const cartParsed = JSON.parse(cart);
    let fullCart = cartParsed;
    const products = await client.lrange('products', 0, -1);
    cartParsed.products.map((productCart, index) => {
      let product = products.filter((product) => {
        return JSON.parse(product).id === +productCart.id;
      });
      if (product.length < 1) {
        fullCart.products[index].product = '';
      } else {
        fullCart.products[index].product = JSON.parse(product[0]);
      }
    });
    const purchases = await client.lrange('purchases', 0, -1);
    let purchase = purchases.filter((purchase) => {
      return JSON.parse(purchase).id === userId;
    });
    if (purchase.length < 1) {
      // No purchase found
      const reply = await client.rpush(
        'purchases',
        JSON.stringify({
          id: userId,
          carts: [
            {
              cart: fullCart,
              date: Date.now(),
            },
          ],
        }),
      );
      await client.lrem('carts', 1, cart[0]);
      res.status(201).json({ purchase: reply });
    } else {
      // Purchase found
      let purchaseParsed = JSON.parse(purchase);
      purchaseParsed.carts.push({
        cart: fullCart,
        date: Date.now(),
      });
      // Removing existing cart
      const reply = await client.lrem('purchases', 1, purchase[0]);
      if (reply !== 1) {
        const err = new Error('Whoops, there was something wrong!');
        err.status = 404;
        throw err;
      }
      // Adding updated purchase
      const reply1 = await client.rpush('purchases', JSON.stringify(purchaseParsed));
      await client.lrem('carts', 1, cart[0]);
      res.status(201).json({ purchase: reply1 });
    }
  } catch (err) {
    next(err);
  }
};
// Get Purchases
exports.getPurchases = async (req, res, next) => {
  let userId = req.userId;
  try {
    // Get all Purchases
    const purchases = await client.lrange('purchases', 0, -1);
    // Find Purchase
    let purchase = purchases.filter((purchase) => {
      return JSON.parse(purchase).id === userId;
    });
    if (purchase.length < 1) {
      // No purchase found
      res.status(200).json({ purchase: '' });
    } else {
      // Purchase found
      res.status(200).json({ purchase: JSON.parse(purchase) });
    }
  } catch (err) {
    next(err);
  }
};

