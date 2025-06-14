"use strict"

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

require('dotenv').config()
const PORT = process.env?.PORT || 8000

require('express-async-errors')

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:8000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}

const app = express()
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use(require('./middlewares/queryHandler'))

app.use('/uploads', express.static(path.join(__dirname, '../upload')))

// Routes:
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')
const messageRoutes = require('./routes/messageRoutes')
const taskRoutes = require('./routes/taskRoutes')
const noteRoutes = require('./routes/noteRoutes')
const deviceRoutes = require('./routes/deviceRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/notes', noteRoutes)
app.use('/api/device', deviceRoutes)

// errorHandler:
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Something went wrong!' })
})

app.listen(PORT, () => console.log('http://127.0.0.1:' + PORT))

module.exports = app 