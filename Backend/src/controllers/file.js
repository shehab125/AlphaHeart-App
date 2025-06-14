"use strict"

// File Controller:

const File = require('../models/file')
const Doctor = require('../models/doctor')
const fs = require('fs')
const path = require('path')

module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["Files"]
            #swagger.summary = "List Files"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

        const data = await res.getModelList(File)

        // res.status(200).send({
        //     error: false,
        //     details: await res.getModelListDetails(File),
        //     data
        // })
        
        // FOR REACT PROJECT:
        res.status(200).send(data)
    },

    create: async (req, res) => {
        /*
            #swagger.tags = ["Files"]
            #swagger.summary = "Create File"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: { $ref: '#/definitions/File' }
            }
        */
        try {
            console.log('File upload request received:', {
                file: req.file,
                body: req.body
            });

            if (!req.file) {
                return res.status(400).send({
                    error: true,
                    message: 'No file uploaded'
                });
            }

            // Verify file exists on disk
            const filePath = path.join('./upload', req.file.filename);
            if (!fs.existsSync(filePath)) {
                return res.status(500).send({
                    error: true,
                    message: 'File was not saved properly'
                });
            }

            // Create file record
            const fileData = {
                userId: req.body.userId,
                userType: req.body.userType || 'doctor',
                fileName: req.file.filename,
                path: path.join('./upload', req.file.filename).replace(/\\/g, '/'),
                mimeType: req.file.mimetype,
                extention: path.extname(req.file.originalname).slice(1)
            };

            console.log('Creating file record:', fileData);

            const data = await File.create(fileData);

            // Update doctor's files array if userId is provided
            if (req.body.userId) {
                await Doctor.updateOne(
                    { _id: req.body.userId },
                    { $push: { files: data.id } }
                );
            }

            res.status(201).send({
                error: false,
                data
            });
        } catch (error) {
            console.error('File upload error:', error);
            res.status(500).send({
                error: true,
                message: 'Error uploading file',
                details: error.message
            });
        }
    },

    read: async (req, res) => {
        /*
            #swagger.tags = ["Files"]
            #swagger.summary = "Get Single File"
        */
        try {
            const data = await File.findOne({ _id: req.params.id });
            if (!data) {
                return res.status(404).send({
                    error: true,
                    message: 'File not found'
                });
            }
            res.status(200).send({
                error: false,
                data
            });
        } catch (error) {
            console.error('File read error:', error);
            res.status(500).send({
                error: true,
                message: 'Error reading file',
                details: error.message
            });
        }
    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Files"]
            #swagger.summary = "Update File"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: { $ref: '#/definitions/File' }
            }
        */
        try {
            if (req.file) {
                // Delete old file if exists
                const oldFile = await File.findOne({ _id: req.params.id });
                if (oldFile && oldFile.path) {
                    try {
                        fs.unlinkSync(oldFile.path);
                    } catch (error) {
                        console.error('Error deleting old file:', error);
                    }
                }

                // Update with new file info
                const filePath = path.join('./upload', req.file.filename);
                req.body.fileName = req.file.filename;
                req.body.path = filePath;
                req.body.mimeType = req.file.mimetype;
                req.body.extention = path.extname(req.file.originalname).slice(1);
            }

            const data = await File.updateOne(
                { _id: req.params.id },
                req.body,
                { runValidators: true }
            );

            res.status(202).send({
                error: false,
                data,
                new: await File.findOne({ _id: req.params.id })
            });
        } catch (error) {
            console.error('File update error:', error);
            res.status(500).send({
                error: true,
                message: 'Error updating file',
                details: error.message
            });
        }
    },

    delete: async (req, res) => {
        /*
            #swagger.tags = ["Files"]
            #swagger.summary = "Delete File"
        */
        try {
            const file = await File.findOne({ _id: req.params.id });

            if (file) {
                // Delete file from disk
                if (file.path) {
                    try {
                        fs.unlinkSync(file.path);
                    } catch (error) {
                        console.error('Error deleting file from disk:', error);
                    }
                }

                // Remove file reference from doctor
                if (file.userId) {
                    await Doctor.updateOne(
                        { _id: file.userId },
                        { $pull: { files: file.id } }
                    );
                }

                const data = await File.deleteOne({ _id: req.params.id });
                res.status(data.deletedCount ? 204 : 404).send({
                    error: !data.deletedCount,
                    data
                });
            } else {
                res.status(404).send({
                    error: true,
                    message: 'File not found'
                });
            }
        } catch (error) {
            console.error('File delete error:', error);
            res.status(500).send({
                error: true,
                message: 'Error deleting file',
                details: error.message
            });
        }
    },
}