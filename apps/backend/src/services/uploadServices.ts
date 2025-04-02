import fs from 'fs';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

// 1. Ensure the 'uploads' directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 2. Configure Multer storage
const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req: Request, file, cb) => {
    // Keep the original filename
    cb(null, file.originalname);
  },
});

// 3. File filter for PDF/DOCX files
function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  const allowedTypes = ['.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only PDF and DOCX are allowed.'));
  }
}

// 4. Create Multer instance with 50MB file size limit
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

