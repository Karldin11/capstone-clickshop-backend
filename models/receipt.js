const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const receiptSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  productsBought: [
    { type: mongoose.Types.ObjectId, required: true, ref: "Product" },
  ],
  total: { type: Number, required: true },
});

module.exports = mongoose.model("Receipt", receiptSchema);
