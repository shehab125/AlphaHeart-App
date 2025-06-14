"use strict"

const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/file:

//const permissions = require('../middlewares/permissions')
const file = require('../controllers/file')
const { upload, handleMulterError } = require('../middlewares/upload')

// URL: /files

router.route('/')
    .get(file.list)
    .post(upload, handleMulterError, file.create)

router.route('/:id')
    .get(file.read)
    .put(upload, handleMulterError, file.update)
    .patch(upload, handleMulterError, file.update)
    .delete(file.delete)

/* ------------------------------------------------------- */
module.exports = router