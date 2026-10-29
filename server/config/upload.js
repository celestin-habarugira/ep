const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirectory = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/zip',
    'application/x-rar-compressed',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/webm',
    'audio/mp4',
    'audio/x-m4a',
    'video/mp4',
    'video/webm',
    'video/ogg',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed. Allowed: images, PDFs, documents, spreadsheets, presentations, text files, archives.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

upload.singleHandled = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (error) => {
    if (!error) return next();
    if (error instanceof multer.MulterError) {
      const tooLarge = error.code === 'LIMIT_FILE_SIZE';
      return res.status(tooLarge ? 413 : 400).json({
        message: tooLarge ? 'File is too large. The maximum upload size is 20 MB.' : 'The upload could not be processed. Please select the file again.',
      });
    }
    if (['ENOENT', 'EACCES', 'ENOSPC', 'EROFS'].includes(error.code)) {
      console.error('Upload storage is unavailable:', error.code);
      return res.status(503).json({ message: 'File storage is temporarily unavailable. Please try again later.' });
    }
    if (error.message?.startsWith('File type not allowed')) {
      return res.status(415).json({ message: error.message });
    }
    console.error('Could not receive uploaded file:', error.message);
    return res.status(500).json({ message: 'Could not receive the uploaded file. Please try again.' });
  });
};

module.exports = upload;
