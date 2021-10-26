require('dotenv').config();
require('express-async-errors');
const cloudinary = require('cloudinary')['v2'];
const fileUpload = require('express-fileupload');
const express = require('express');
const app = express();
cloudinary.config({
  cloud_name: process.env.C_NAME,
  api_key: process.env.API_Key,
  api_secret: process.env.API_SECRET,
});
const productsRoute = require('./routes/productRoutes');
// database
const connectDB = require('./db/connect');

app.use(express.json());
app.use(fileUpload({useTempFiles:true}));
app.use(express.static('./public'));

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
app.get('/', (req, res) => {
  res.send('<h1>File Upload Starter</h1>');
});

app.use('/api/v1/products', productsRoute);
// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${ port }...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
