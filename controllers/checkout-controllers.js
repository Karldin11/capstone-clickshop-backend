const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Product = require("../models/product");
const User = require("../models/user");
const Receipt = require("../models/receipt");

const getAllReceipts = async (req, res, next) => {
  //const userId = req.params.uid;

  let receipts;
  try {
    receipts = await Receipt.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching receipts failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    receipts: receipts.map((receipt) => receipt.toObject({ getters: true })),
  });
};

const getUserOrders = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithOrders;
  try {
    userWithOrders = await User.findById(userId).populate("orders");
  } catch (err) {
    const error = new HttpError(
      "Fetching orders failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    orders: userWithOrders.orders.map((order) =>
      order.toObject({ getters: true })
    ),
  });
};

const getUserReceipts = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithReceipts;
  try {
    userWithReceipts = await User.findById(userId).populate("receipts");
  } catch (err) {
    const error = new HttpError(
      "Fetching receipts failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    userReceipts: userWithReceipts.receipts,
  });
};

const addReceipt = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Server: Invalid inputs passed, please check your data.",
        422
      )
    );
  }

  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Server:Something went wrong, could not find your user.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Server:Could not find user for provided id.",
      404
    );
    return next(error);
  }

  if (user.orders.length === 0) {
    const error = new HttpError(
      "Server:This user does not have any products to be bought",
      404
    );
    return next(error);
  }

  const { address, total } = req.body;

  const generatedReceipt = new Receipt({
    name: user.name,
    address,
    productsBought: user.orders,
    total: parseFloat(total),
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await generatedReceipt.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Server: Generating receipt failed, please try again.",
      500
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    user.receipts.push(generatedReceipt);
    user.orders = [];
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Server: Adding receipt failed, please try again.",
      500
    );
    return next(error);
  }

  console.log(user);

  res.status(200).json({ Receipts: user.receipts });
};

const addProductToOrders = async (req, res, next) => {
  const productId = req.params.pid;
  const userId = req.params.uid;

  let user;
  let product;
  try {
    product = await Product.findById(productId);
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Server:Something went wrong, could not find either the product or  your user.",
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError(
      "Server:Could not find product for the provided id.",
      404
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Server:Could not find user for provided id.",
      404
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    user.orders.push(product);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Server: Adding order failed, please try again.",
      500
    );
    return next(error);
  }

  console.log(user);

  res.status(200).json({ userOrders: user.orders });
};

const removeProductFromOrders = async (req, res, next) => {
  const productId = req.params.pid;
  const userId = req.params.uid;

  let user;
  let product;
  try {
    product = await Product.findById(productId);
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find either the product or  your user.",
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError(
      "Could not find product for the provided id.",
      404
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    let index = user.orders.lastIndexOf(product);
    user.orders.splice(index, 1);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Adding order failed, please try again.", 500);
    return next(error);
  }

  console.log(user);

  res.status(200).json({ userOrders: user.orders });
};

exports.getUserOrders = getUserOrders;
exports.getAllReceipts = getAllReceipts;
exports.getUserReceipts = getUserReceipts;

exports.addProductToOrders = addProductToOrders;
exports.removeProductFromOrders = removeProductFromOrders;
exports.addReceipt = addReceipt;
