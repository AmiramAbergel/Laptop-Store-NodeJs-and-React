const path = require('path');
const express = require('express');
const morgan = require('morgan');
// Cross-Origin Resource Sharing (CORS) -security
const cors = require('cors');

//!!==instructions==!! Before running tests lets make sure we makes lines 9 and 18 in comment this is to make sure that our tests will not
// fail as it sends a lot of requests that trigger DDos attack
const rateLimiterRedisMiddleware = require("./protection");

// Importing Routes
const routes = require('./routes');

// Init app
const app = express();

// Protection
app.use(rateLimiterRedisMiddleware);

// CORS
app.options('*', cors());
app.use(
  cors({
    origin: function (origin, callback) {
      if (['http://localhost:3000', 'http://127.0.0.1:3000'].indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);

// Logger
app.use(process.env.PORT ? morgan('combined', { stream: accessLogStream }) : morgan('dev'));

// Request data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serving Images Statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/', routes);

// Error Handler
app.use((error, req, res, next) => {
  const message = error.message;
  const status = error.status || 500;
  res.status(status).json({ error: { message: message, status: status } });
});

// Set Port
const PORT = process.env.PORT || 8000;

// App starting
app.listen(PORT, function () {
  console.log('Server started on port ' + PORT);
});

module.exports = app;
