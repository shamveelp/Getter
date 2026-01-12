import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    upload_preset: process.env.CLOUDINARY_PRESET,
};

console.log("Cloudinary Config Loaded:", {
    cloud_name: config.cloud_name,
    api_key: config.api_key ? "***" : "MISSING",
    api_secret: config.api_secret ? "***" : "MISSING",
});

cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
});

export default cloudinary;
