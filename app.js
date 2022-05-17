//third party libraries, Node core nodules

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//imports
const productsRoutes = require("./routes/products-routes");
const usersRoutes = require("./routes/users-routes");
const checkoutRoutes = require("./routes/checkout-routes");
const HttpError = require("./models/http-error");

//app
const app = express();

//middlewares
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/products", productsRoutes);
app.use("/users", usersRoutes);
app.use("/checkout", checkoutRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

mongoose
  .connect(
    //`mongodb+srv://karla:kardin@cluster0.gpw0q.mongodb.net/bootcamp?retryWrites=true&w=majority`
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gpw0q.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(8000); //listening on 8000 localhost
  })
  .catch((err) => {
    console.log(err);
  });
