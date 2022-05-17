const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  orders: [{ type: mongoose.Types.ObjectId, required: true, ref: "Product" }], //elementos agregados en shopping cart
  receipts: [{ type: mongoose.Types.ObjectId, required: true, ref: "Receipt" }],
});

module.exports = mongoose.model("User", userSchema);
