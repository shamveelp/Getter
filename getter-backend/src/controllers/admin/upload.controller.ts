import { Request, Response } from "express";
import { injectable } from "inversify";
import cloudinary from "../../config/cloudinary";
import streamifier from "streamifier";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";

@injectable()
export class UploadController {

    uploadImage = async (req: Request, res: Response) => {
        try {
            if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
                logger.error("Cloudinary config missing in environment variables");
                throw new CustomError("Server configuration error: Cloudinary credentials missing", StatusCode.INTERNAL_SERVER_ERROR);
            }

            if (!req.file) {
                logger.error("No file uploaded in request");
                throw new CustomError("No file uploaded", StatusCode.BAD_REQUEST);
            }

            logger.info(`Starting image upload. File size: ${req.file.size} bytes`);

            const streamUpload = (req: Request) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            upload_preset: process.env.CLOUDINARY_PRESET!,
                            // folder: "getter/services", // Preset usually handles folder
                        },
                        (error, result) => {
                            if (result) {
                                resolve(result);
                            } else {
                                logger.error("Cloudinary Upload Stream Error:", error); // Log exact Cloudinary error
                                reject(error);
                            }
                        }
                    );
                    streamifier.createReadStream(req.file!.buffer).pipe(stream);
                });
            };

            const result: any = await streamUpload(req);

            logger.info("Image uploaded successfully:", result.secure_url);

            res.status(StatusCode.OK).json({
                success: true,
                url: result.secure_url,
                public_id: result.public_id
            });

        } catch (error) {
            logger.error("Error uploading image (Controller catch):", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: (error as Error).message });
        }
    };
}
