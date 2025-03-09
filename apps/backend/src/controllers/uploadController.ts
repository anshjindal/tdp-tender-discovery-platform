import fs from 'fs'
import path from 'path'
import multer, { FileFilterCallback } from 'multer'
import { Request, Response, NextFunction } from 'express'

// Ensure the 'uploads' directory exists using the project root directory
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    // Files will be stored in the 'uploads' folder
    cb(null, uploadsDir)
  },
  filename: (req: Request, file, cb) => {
    // Keep the original filename
    cb(null, file.originalname)
  },
})

// File Filter for PDF/DOCX files
function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  const allowedTypes = ['.pdf', '.docx']
  const ext = path.extname(file.originalname).toLowerCase()

  if (allowedTypes.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Unsupported file type. Only PDF and DOCX are allowed.'))
  }
}

// Multer Instance with 50MB file size limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
})

// Controller function for handling file uploads
const uploadFiles = [
  // Process file uploads with Multer middleware
  upload.array('files'),
  // Handle the request after files are processed
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded.',
      })
    }

    const filesInfo = (req.files as Express.Multer.File[]).map(file => ({
      originalName: file.originalname,
      path: file.path,
      size: file.size,
    }))

    res.status(201).json({
      success: true,
      message: 'Files uploaded successfully.',
      files: filesInfo,
    })
  }
]

export { uploadFiles }

