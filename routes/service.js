const express = require("express");
const router = express.Router();
const Service = require("../models/service");
const mongoose = require("mongoose");
// const checkAuth=require('../middleware/check-auth')
const cloudinary=require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: 'alpja', 
  api_key: '556517137364383', 
  api_secret: 'FCqYSd-J1Kew_VgMCOBZSIcqnJY'

});

router.get("/", (req, res, next) => {
    Service.find()
    .then((result) => {
      res.status(200).json({
        serviceData: result,
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
 
  const service = new Service({
    _id:new mongoose.Types.ObjectId(),
    name:req.body.name,
    price:req.body.price,
    description:req.body.description,
    type:req.body.type,
    countInStock:req.body.countInStock,
  
    imageUrl:result.url
  })
  service.save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        newService: result,
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
  Service.findById(req.params.id).then(result=>{
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

// router.delete('/:id', (req, res) => {
//   Service.remove({
//     _id: req.params.id
//   }), function (err, user) {
//     if (err) {
//       return res.send(err);
//     }
// console.log(_id)
//     res.json({ message: 'Deleted'
    
//   })}
// })


router.delete('/:id',async (req,res,next)=>{
    
  await Service.deleteOne({"_id":req.params.id})
  .then(result=>{
      res.status(200).json({
          message:"Service is deleted",
          result:result
      })
  }).catch(err=>{
      res.status(500).json({
          error:err
      })
  })
  })
  router.put('/:id', async (req, res) => {
    try {
        const serviceId = req.params.id;

        // Check if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
            return res.status(400).json({ error: 'Invalid service ID format' });
        }

        // Log the request body
        console.log('Updating Service ID:', serviceId);
        console.log('Request Body:', req.body);

        // Perform the update with { new: true } to return updated doc
        const updatedService = await Service.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(serviceId) },
            {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                type: req.body.type,
                countInStock: req.body.countInStock,
                imageUrl: req.body.imageUrl
            },
            { new: true } // return updated document
        );

        if (!updatedService) {
            return res.status(404).json({ error: 'Service not found or not updated' });
        }

        console.log('Updated Service:', updatedService);
        res.status(200).json({ updated_service: updatedService });
    } catch (err) {
        console.error('Error during update:', err);
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;
