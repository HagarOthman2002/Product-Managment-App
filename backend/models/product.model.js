const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true  },
  description : { type: String},
  price : { type: Number, required: true },
  category : { type: String},
  img: { type: String },
  inStock : { type: Boolean, default: true },
 
});
module.exports = mongoose.model("Product", productSchema);
