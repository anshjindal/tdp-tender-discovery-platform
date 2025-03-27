import { upload } from '../../services/uploadServices';

// We export an array of middleware: first Multer, then the actual controller handler
export const uploadFiles = [
  // 1. Multer middleware for handling the file upload
  upload.array('files'),

  // 2. The final controller logic once files are processed
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded.',
      });
    }

    const filesInfo = (req.files as Express.Multer.File[]).map((file) => ({
      documentId: file.originalname, // Added documentId using the original file name
      originalName: file.originalname,
      path: file.path,
      size: file.size,
    }));

    return res.status(201).json({
      success: true,
      message: 'Files uploaded successfully.',
      files: filesInfo,
    });
  },
];

