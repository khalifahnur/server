import cloudinary from './Cloudinary';

export const uploadImageToCloudinary = async (file: Express.Multer.File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "restaurants" }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result?.secure_url || "");
          }
        })
        .end(file.buffer);
    });
  };

  export const uploadMenuToCloudinary = async (file: Express.Multer.File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "menu" }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result?.secure_url || "");
          }
        })
        .end(file.buffer);
    });
  };