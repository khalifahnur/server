"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMenuToCloudinary = exports.uploadImageToCloudinary = void 0;
const Cloudinary_1 = __importDefault(require("./Cloudinary"));
const uploadImageToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
        Cloudinary_1.default.uploader
            .upload_stream({ folder: "restaurants" }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result?.secure_url || "");
            }
        })
            .end(file.buffer);
    });
};
exports.uploadImageToCloudinary = uploadImageToCloudinary;
const uploadMenuToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
        Cloudinary_1.default.uploader
            .upload_stream({ folder: "menu" }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result?.secure_url || "");
            }
        })
            .end(file.buffer);
    });
};
exports.uploadMenuToCloudinary = uploadMenuToCloudinary;
//# sourceMappingURL=UploadImage.js.map