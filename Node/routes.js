const express = require('express');
const multer = require('multer');
const router = express.Router();

// import controller
const controller = require('./controllers');
const sessionCheck = require('./sessionCheck');

// Uploads Functioning
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
var upload = multer({ storage: storage });

// ============= Account =============
// Registration
router.post('/register', controller.register);
// Login
router.post('/login', controller.login);

// ============= User Management =============
// Get all users
router.get('/users', sessionCheck, controller.allUsers);
// Get user
router.get('/user/:id', sessionCheck, controller.searchUser);
// Delete user
router.delete('/user/:id', sessionCheck, controller.deleteUser);

// ============= Products =============
// Get all products
router.get('/products', sessionCheck, controller.allProducts);
// Create product
router.post('/product/create', sessionCheck, upload.single('image'), controller.createProduct);
// Get product
router.get('/product/:id', sessionCheck, controller.getProduct);
// Edit product
router.put('/product/:id', sessionCheck, upload.single('image'), controller.editProduct);
// Delete product
router.delete('/product/:id', sessionCheck, controller.deleteProduct);

// Add to cart
router.post('/addtocart', sessionCheck, controller.addToCart);
// Get cart
router.get('/getcart', sessionCheck, controller.getCart);

// Make purchase
router.get('/purchase', sessionCheck, controller.purchase);
// Get purchases
router.get('/purchases', sessionCheck, controller.getPurchases);

module.exports = router;
