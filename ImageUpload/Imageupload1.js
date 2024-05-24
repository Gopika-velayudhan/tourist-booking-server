import fs from 'fs';
import path from 'path';
import multer from 'multer';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import { fileURLToPath } from 'url'; 

dotenv.config();

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname); 
  },
});

const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Api_Key,
  api_secret: process.env.Api_Secret,
});

const uploadSingleImage = (req, res, next) => {
  upload.single('Profileimg')(req, res, async (err) => { 
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'profile-imgs',
        });

        if (!result || !result.secure_url) {
          throw new Error('Upload to Cloudinary failed');
        }

        fs.unlink(req.file.path, (unlinkerError) => {
          if (unlinkerError) {
            console.log('Error deleting local file', unlinkerError);
          }
        });

        req.body.Profileimg = result.secure_url;
      } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        return res.status(500).json({
          message: 'Error uploading file to Cloudinary',
        });
      }
    }

    next();
  });
};

export default uploadSingleImage;
