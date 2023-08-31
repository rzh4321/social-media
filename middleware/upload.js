import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { promises as fsPromises } from 'fs';

const upload = multer({
  storage: multer.memoryStorage(), // Store the uploaded file in memory
});

export const config = {
  api: {
    bodyParser: false, // Disable the built-in body parser
  },
};

export default upload.single('image'); // Middleware to handle a single file upload
