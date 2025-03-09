import express from 'express'
import { uploadFiles } from '../controllers/uploadController'

const router = express.Router()

// POST route for file uploads
router.post('/', uploadFiles)

export default router

