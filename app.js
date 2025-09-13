/* eslint-disable no-path-concat */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-template */
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require("cors");
const bodyParser = require('body-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
require('./utils/cronJob');

const categoryRouter = require('./routes/categoryRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const withdrawalRoutes = require('./routes/withdrawRoutes');
const contactRouter = require('./routes/contactRoutes');

require('./utils/cronJob');

const app = express();
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use("/public", express.static(__dirname + "/public/img"));

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('dev'));
}
// checking routes
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 5 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an 5 mintes!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Serving static files
// app.use(express.static(`${__dirname}/public`));
// app.use("/public/img/users", express.static(__dirname + "/public/img/users"));
app.use("/public/", express.static(__dirname + "/public/"));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/withdrawals', withdrawalRoutes);
app.use('/api/v1/contacts', contactRouter);

// // Default root route
// app.get("/", (req, res) => {
//   res.status(200).json({
//     status: "success",
//     message: "Welcome to Hamza API 🚀",
//   });
// });

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
