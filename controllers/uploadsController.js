// noinspection JSUnusedLocalSymbols

const { StatusCodes } = require('http-status-codes');
const path = require('path');
const CustomError = require('../errors');
const cloudinary = require('cloudinary')['v2'];
const fs = require('fs');
const uploadProductImage = async (req, res) => {
  console.log(req.files);
  if (!req.files) {
    throw new CustomError.BadRequestError(`please add the file`);
  }
  const productImage = req.files.image;
  const imagePath = path.join(__dirname,
    '../public/uploads/' + `${ productImage.name }`);
  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please upload Image');
  }
  const maxSize = 1024;
  if (!productImage.size > maxSize) {
    throw new CustomError.BadRequestError('please upload image smaller 1MB');
  }
  await productImage.mv(imagePath, (err) => {
    err ? res.status(StatusCodes.NOT_FOUND).json(err)
      : res.status(StatusCodes.OK)
        .json({ image: { src: `uploads/${ productImage.name }` } });
  });

  // res.send(`upload product image`);
};

const uploadImageToCloud = async (req, res) => {
  const result = await cloudinary.uploader.upload(req.files.image.tempFilePath,
    {
      use_filename: true, folder: 'file-upload',
    });
  console.log(result);
  fs.unlinkSync(req.files.image.tempFilePath);
  return res.status(StatusCodes.OK).json({ img: { src: result['secure_url'] } });
};

module.exports = { uploadImageToCloud };