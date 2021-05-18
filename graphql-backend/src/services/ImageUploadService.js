import * as mongoose from "mongoose";

class ImageService {
    private static gfs: any;
    static async initializeImageService(db) {
        this.gfs = new mongoose.mongo.GridFSBucket(db, {
            bucketName: "uploads"
        });
    }
    static async getImageByFileName(filename) {
        this.gfs.find({ filename }).toArray((err, files) => {
            if (!files[0] || files.length === 0) {
                return {
                    success: false,
                    message: 'No files available',
                };
            }

            return {
                success: true,
                file: files[0],
            };
        });
    }

}

export default ImageService;
