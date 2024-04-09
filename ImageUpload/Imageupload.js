import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';
import { config as configDotenv } from 'dotenv';
import sanitizeFilename from 'sanitize-filename'; 

configDotenv();

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads'),
    filename: (req, file, cb) => {
        const sanitizedFilename = sanitizeFilename(file.originalname)
        cb(null, Date.now() + sanitizedFilename);
    },
});

const upload = multer({ storage });
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const imageUpload = (req, res, next) => {
    upload.single("image")(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "tourist-packages", 
            });
            req.body.image = result.secure_url;
            await fs.unlink(req.file.path); 
            next();
        } catch (error) {
            console.error("Error uploading file to Cloudinary:", error);
            return res.status(500).json({ error: "Error uploading file to Cloudinary" });
        }
    });
};
