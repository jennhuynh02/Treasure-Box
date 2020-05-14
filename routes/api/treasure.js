const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const keys = require('../../config/keys');
const passport = require('passport');
const Treasure = require('../../models/treasure');
const User = require('../../models/user');
const SavedTreasure = require('../../models/savedTreasure');

const s3Bucket = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
  Bucket: keys.bucketName
});

// UPLOAD FILE
const imageUpload = multer({
  storage: multerS3({
    s3: s3Bucket,
    bucket: keys.bucketName,
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
    }
  }),
  limits: {
    fileSize: 4000000
  },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|mov/;  // Allowed extensions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check ext
  const mimetype = filetypes.test(file.mimetype);  // Check mime
  if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }

router.post('/upload', (req, res) => {
  // add ternary logic for upload quote? or new route for upload quote?
  console.log(req)
  imageUpload(req, res, (error) => {
    if (error) {
      res.json({ error: error })
    } else if (req.file) {
      const uploadedTreasure = new Treasure({
        creatorId: req.body.ownerId,
        url: req.file.location,
        ownerId: null,
        reported: false,
        reportMessage: '',
        type: 'media',
      });

      User.updateOne(      
        { _id: req.body.ownerId },
        { $inc: { keyCount: 1 } }, 
        { new: true },
      )

      uploadedTreasure.save();

      res.json({
        owner: uploadedTreasure.creatorId,
        treasureId: uploadedTreasure._id,
        location: uploadedTreasure.url,
      });
      
    // POST request for quotes
    } else if (req.quoteText) {
      // const uploadedQuote = new Treasure({
      //   // shape this however you think will work best
      // });
    }
  });
});

router.get('/all', (req, res) => {
  Treasure.find({}, {url:1, reported:1, reportMessage:1})
    .then((treasures) => res.json(treasures))
    .catch((errors) => res.statusMessage(400).json({
      notreasuresfound: "No Treasures Found"
    }))
})

router.get('/new/:id', (req, res) => {
  Treasure.countDocuments({ ownerId: null }).exec(function (err, count) {
    var rand = Math.floor(Math.random() * count)

    Treasure.findOne({ownerId: null}).skip(rand)
      .then(treasure => res.json(treasure))
      .then(() => {
        User.updateOne(      
          { _id: req.params.id },
          { $inc: { keyCount: -1 } }, 
          { new: true },
        )
        .catch(err => res.json(err))
      })
      .catch(err => res.json(err))
  })
}) 
  
router.delete('/:treasureId', (req, res) => {
  Treasure.findByIdAndDelete(req.params.treasureId, function (err) {
  if (err) console.log(err);
  console.log("Successful deletion");
  res.json({});
  });
});

router.put('/update', (req, res) => {
  console.log(req.params)
  Treasure.findByIdAndUpdate(
    { _id: req.params.id },
    { reported: true },
    { reportMessage: req.params.body},
    function(err, result) {
      if (err) {
        res.json(err)
      } else {
        res.json(result)
      } 
    }
  )
})

router.get('/collection/:id', (req, res) => {
  console.log(req.params.id)
  Treasure.find({ ownerId: req.params.id})
    .then((treasures) => res.json(treasures))
    .catch((err) => console.log(err))
})

module.exports = router;
