"use strict"

const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../upload').replace(/\\/g, '/')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

// File filter
const fileFilter = (req, file, cb) => {
    // Allow only images and PDFs
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false)
    }
}

// Create multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
})

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File size too large. Maximum size is 5MB.'
            })
        }
        return res.status(400).json({
            message: err.message
        })
    } else if (err) {
        return res.status(400).json({
            message: err.message
        })
    }
    next()
}

module.exports = {
    upload: upload.single('image'),
    handleMulterError
}