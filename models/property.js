const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the name"],
  },
  propertyType: {
    type: String,
    required: [true, "Please enter Property Type"],
    enum: {
      values: ["Sell", "Rent"],
    },
  },
  propertyCategory: {
    type: String,
    required: [true, "Please enter category"],
    enum: {
      values: [
        "Single_Family",
        "Villa",
        "Office",
        "Studio",
        "Penthouse",
        "Apartment",
        "Restaurant",
      ],
    },
  },
  image: {
    type: String
  },
  price: {
    type: Number,
    required: [true, "Please enter the price"],
  },
  description: {
    type: String,
  },
  address: {
    type: String,
    required: [true, "Please enter the address"],
  },
  bedroom: {
    type: Number,
    default: 0,
  },
  bathroom: {
    type: Number,
    default: 0,
  },
  squareFoot: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Property", propertySchema);
