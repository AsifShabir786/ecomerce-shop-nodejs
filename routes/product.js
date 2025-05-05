const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");
const checkAuth=require('../middleware/check-auth')
const cloudinary=require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: 'alpja', 
  api_key: '556517137364383', 
  api_secret: 'FCqYSd-J1Kew_VgMCOBZSIcqnJY'

});

router.get("/", (req, res, next) => {
    Product.find()
    .then((result) => {
      res.status(200).json({
        productData: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
router.post("/",
// checkAuth,
(req, res, next) => {
  const file=req.files.photo;
  cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
    console.log(result.url);

  const product = new Product({
    _id:new mongoose.Types.ObjectId(),
    name:req.body.name,
    price:req.body.price,
    description:req.body.description,
    type:req.body.type,
    countInStock:req.body.countInStock,
  
    imageUrl:result.url
  })
  product.save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        newProduct: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    })  
  })
});
router.get("/:id", (req, res, next) => {
  console.log(req.params.id);
  Product.findById(req.params.id).then(result=>{
res.status(200).json({
    product:result
})
  }).catch(err=>{
    console.log(err);
    res.status(500).json({
        error:err
    })
  })
});
router.delete('/:id',(req,res,next)=>{
Product.remove({_id:req.params.id})
.then(result=>{
    res.status(200).json({
        message:"Product deleted",
        result:result
    })
}).catch(err=>{
    res.status(500).json({
        error:err
    })
})
})
router.put('/:id', (req, res, next) => {
  // Log the incoming ID and request body for debugging
  console.log('ID to update:', req.params.id);
  console.log('Request body:', req.body);

  // Convert the ID to an ObjectId
  const productId = mongoose.Types.ObjectId(req.params.id);

  // First, find the product to ensure it exists
  Product.findOne({ _id: productId })
      .then(product => {
          // If no product is found, return a 404 error
          if (!product) {
              return res.status(404).json({ error: 'Product not found' });
          }

          // Log the product found before updating
          console.log('Product before update:', product);

          // Perform the update
          return Product.findOneAndUpdate(
              { _id: productId },
              {
                  name: req.body.name,
                  price: req.body.price,
                  description: req.body.description,
                  type: req.body.type,
                  countInStock: req.body.countInStock,
                  imageUrl: req.body.imageUrl
              },
              { new: true } // Ensure the response returns the updated product
          );
      })
      .then(updatedProduct => {
          // If the product was updated successfully, send back the updated data
          if (!updatedProduct) {
              return res.status(404).json({ error: 'Product not updated' });
          }

          console.log('Updated Product:', updatedProduct);
          res.status(200).json({ updated_product: updatedProduct });
      })
      .catch(err => {
          console.log('Error updating product:', err);
          res.status(500).json({ error: err.message });
      });
});
module.exports = router;
