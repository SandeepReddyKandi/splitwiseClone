import {DB_URL} from "../config/config";
import * as path from "path";

import * as multer from "multer";
import * as GridFsStorage from "multer-gridfs-storage";

const storage = new GridFsStorage({
    url: DB_URL,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise((resolve) => {
            const filename = new Date().getTime() + path.extname(file.originalname);
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
            };
            resolve(fileInfo);
        });
    }
});

const upload = multer({ storage });

export default upload.single('image');
