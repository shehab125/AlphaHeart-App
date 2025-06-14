"use strict"


const { mongoose } = require('../configs/dbConnection')

const { genders } = require('../configs/constraints')

// Doctor Model:

const DoctorSchema = new mongoose.Schema({

    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        index: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    title: {
        type: String,
        trim: true,
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    street: {
        type: String,
        trim: true,
        required: true
    },
    zipCode: {
        type: Number,
        required: true
    },
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    },
    cityName: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
    },
    branch:{
        type: String,
        trim: true,
    },
    birthDate: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: genders,
        trim: true
    },
    avatar: {
        type: String,
    },
    doc: {
        type: String,
    },
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }],
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    about: {
        type: String,
        trim: true
    },
    languages: [{
        type: String
    }],
    website: {
        type: String,
        trim: true
    },
    messages: [{            
        type: mongoose.Schema.Types.ObjectId,
        ref:'Message',
        required: true,
    }],
    // services: [{            
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'Service'
    // }],
    services: [{            
        type: String
    }],
    appointments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    messageCount: {
        type: Number,
        default: 0
    },
    isChecked: {
        type: Boolean,
        default: true,
    },
    fee: {
        type: Number,
        default: 0
    },
    workingSchedule: [{
        date: {
            type: Date,
            required: true
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    }],
    isStaff: {
        type: Boolean,
        default: true
    },
    isDoctor: {
        type: Boolean,
        default: false
    },
    resetToken: {
        type: String,
    },
    resetTokenExpires: {
        type: Date,
    },
})


const validation = require('../helpers/validation')

DoctorSchema.pre('save', validation)

// FOR REACT PROJECT:
DoctorSchema.pre('init', function (data) {
    data.id = data._id
    if (data.createdAt) {
    data.createds = data.createdAt.toLocaleDateString('de-de')
    }
})
/* ------------------------------------------------------- */
module.exports = mongoose.model('Doctor', DoctorSchema)
