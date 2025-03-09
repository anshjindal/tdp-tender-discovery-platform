import { Request, Response, NextFunction } from 'express'
import multer from 'multer'

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds the 50MB limit.',
      })
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    })
  } else if (err) {
    // Handle general errors
    return res.status(400).json({
      success: false,
      message: err.message,
    })
  }
  next()
}

export default errorHandler

