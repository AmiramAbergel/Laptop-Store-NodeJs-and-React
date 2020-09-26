const request = require('supertest');
const app = require('./index');
fetch = require('node-fetch');
axios = require('axios');

let cookieSession = '';

// Be aware before testing you should go to index.js in Node folder and follow the instructions there!
//Using node fetch() to test my server
// (be aware that fetch() is being used everywhere we are contacting in the Reactjs application)

const FE_URL = 'http://localhost:3000';

//test the login page
fetch(`${FE_URL}`)
    .then(res => res.status)
    .then((status) => {
        console.log("the status code for the login page is: " + status);

        // testing the login page
        fetch(`${FE_URL}/src/Auth`, {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },})

        // testing Register page
        fetch(`${FE_URL}/register`).then(res => res.status)
            .then((status) => {
                console.log("the status code for the Register page is: " + status)
            });
    });


// Rest of tests (not using node fetch() here)

describe('Here we are testing the User Management: (5 tests)', () => {
  beforeAll(async () => {
    const res = await request(app).post('/login').send({
      email: 'amiram@gmail.com',
      password: '123456',
    });
    cookieSession = res.body.session;
  });

  afterAll(() => {
    app.close();
  });

  // Login test check existing account in the system.
  it('1. Should login successfully', async (done) => {
    const res = await request(app).post('/login').send({
      email: 'amiram@gmail.com',
      password: '123456',
      remember: false,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    done();
  });
  // All Users
  it('2. Should get all users', async (done) => {
    const res = await request(app).get('/users').set('Authorization', cookieSession);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('users');
    done();
  });
  // Get a user
  it('3. Should get a user', async (done) => {
    const res = await request(app).get('/user/amiram').set('Authorization', cookieSession);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    done();
  });
  // Register a user - new one (existing one will cause a failure)
  it('4. Should create a user', async (done) => {
    const res = await request(app).post('/register').send({
      firstName: 'TestingNewAccount',
      lastName: 'TestingNewAccount',
      email: 'TestingNewAccount@gmail.com',
      password: '123123',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('user');
    done();
  });
  // Delete the user we just registered
  it('5. Should delete a user', async (done) => {
    const res = await request(app).delete('/user/TestingNewAccount').set('Authorization', cookieSession);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('user');
    done();
  });
});

describe('Here we are testing our Store Management: (4 tests)', () => {
  beforeAll(async () => {
    const res = await request(app).post('/login').send({
      email: 'amiram@gmail.com',
      password: '123456',
    });
    cookieSession = res.body.session;
  });

  afterAll(() => {
    app.close();
  });

  //Get All Products in system
  it('1. Should get all products', async (done) => {
    const res = await request(app).get('/products').set('Authorization', cookieSession);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('products');
    done();
  });
  // Get a specific product in system
  it('2. Should get a product', async (done) => {
    const res = await request(app)
    .get('/product/1599566617887')
    .set('Authorization', cookieSession);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('product');
    done();
    });
  // Get my existing cart
  it('3. Should get cart', async (done) => {
    const res = await request(app).get('/getcart').set('Authorization', cookieSession);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('cart');
    done();
  });
  // Get recent purchases
  it('4. Should get purchases', async (done) => {
    const res = await request(app).get('/purchases').set('Authorization', cookieSession);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('purchase');
    done();
  });
});


