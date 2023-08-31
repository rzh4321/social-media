import multer from "multer";

// Set up multer for image upload.
const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 16 * 1024 * 1024, // Maximum file size: 16 MB.
  },
  fileFilter (req, file, cb) {
    // Only allow jpeg/jpg files.
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
}).single('image');

export function test(req) {
  return new Promise((resolve, reject) => {
    uploadImage(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result);
    })
  })
}

export const config = {
    matcher: '/api/autuhuser/posts/:userId'
}