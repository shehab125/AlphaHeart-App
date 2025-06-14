"use strict"

const express = require('express')
const router = express.Router()
/* ------------------------------------------------------- */
// routes/appointment:

const appointment = require('../controllers/appointment')
const { isAdmin, isDoctor, isPatient } = require('../middlewares/permissions')

// URL: /appointments

// GET /appointments
router.get('/', appointment.list)

// POST /appointments
router.post('/', isPatient, appointment.create)

// GET /appointments/:id
router.get('/:id', appointment.read)

// PUT /appointments/:id
router.put('/:id', appointment.update)

// POST /appointments/day
router.post('/day', appointment.getOrCreateDayAppointments)

/* ------------------------------------------------------- */
module.exports = router