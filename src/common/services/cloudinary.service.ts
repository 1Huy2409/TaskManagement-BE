import type { Express } from "express";
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";
import { BadRequestError, InternalServerError } from "@/common/handler/error.response";

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ensureConfigured = () => {
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    if (!cloudinaryUrl) {
        throw new BadRequestError('CLOUDINARY_URL is not configured');
    }
    cloudinary.config({ secure: true }); // uses CLOUDINARY_URL from env
};

export const uploadImageBuffer = async (
    file: Express.Multer.File,
    options?: Pick<UploadApiOptions, 'folder' | 'public_id' | 'overwrite'>
): Promise<UploadApiResponse> => {
    ensureConfigured();
    if (!ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
        throw new BadRequestError('Only image files (jpeg, png, webp) are allowed');
    }

    return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image',
                folder: options?.folder,
                public_id: options?.public_id,
                overwrite: options?.overwrite ?? true,
            },
            (error, result) => {
                if (error || !result) {
                    return reject(new InternalServerError('Failed to upload avatar to Cloudinary'));
                }
                resolve(result);
            }
        );

        uploadStream.end(file.buffer);
    });
};
