const Property = require("../models/property");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const APIFeatures = require("../utils/apifeatures");
const cloudinary = require('cloudinary')

// Creating new Property to the database
exports.property = catchAsyncErrors(async (req, res, next) => {
  // let image = []
  // if(typeof req.body.image === 'string'){
  //   image.push(req.body.image)
  // }
  // else{
  //   image = req.body.image
  // }

  // let imageLinks = []
  // for(let i=0; i<image.length; i++){
  //   const result = await cloudinary.v2.uploader.upload(image[1],{
  //     folder: 'products'
  //   })

  //   imageLinks.push({
  //     public_id:result.public_id,
  //     url:result.secure_url
  //   })
  // }

  // req.body.image = imageLinks


  req.body.user = req.user.id;
  


  const product = await Property.create(req.body);
  product.save()
  res.status(201).json({
    success: true,
    product,
  });
});

// Fetching all the property from the database
exports.getProperty = catchAsyncErrors(async (req, res, next) => {
  const apiFeatures = new APIFeatures(Property.find(), req.query)
    .search()
    .filter()
    .pagination();

  const product = await apiFeatures.query;

  res.status(200).json({
    success: true,
    product,
  });
});

// Fetching the single property from the database

exports.singleProperty = catchAsyncErrors(async (req, res, next) => {
  const product = await Property.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Updating property

exports.updateProperty = catchAsyncErrors(async (req, res, next) => {
  let product = await Property.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete property by find it through its {id}

exports.deleteProperty = catchAsyncErrors(async (req, res, next) => {
  await Property.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  // if product exists then simply remove it
  await product.remove();

  res.status(200).json({
    success: true,
  });
});
