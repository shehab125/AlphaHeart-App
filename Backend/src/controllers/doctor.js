"use strict"

// Doctor Controller:
const sendMail = require('../helpers/sendMail')
const Doctor = require('../models/doctor')
const EMAIL = process.env.EMAIL
module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["Doctors"]
            #swagger.summary = "List Doctors"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

        // const data = await res.getModelList(Doctor, {}, ["branchId", "cityId", "services"])
        const data = await res.getModelList(Doctor)
    
        // res.status(200).send({
        //     error: false,
        //     details: await res.getModelListDetails(Doctor),
        //     data
        // })
        
        // FOR REACT PROJECT:
        res.status(200).json({
            number:data.length,
            data
        })
    },

    create: async (req, res) => {
        /*
            #swagger.tags = ["Doctors"]
            #swagger.summary = "Create Doctor"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: { $ref: '#/definitions/Doctor' }
            }
        */

        const data = await Doctor.create(req.body)
        

        res.status(201).send({
            error: false,
            data
        })
    },

    read: async (req, res) => {
        /*
            #swagger.tags = ["Doctors"]
            #swagger.summary = "Get Single Doctor"
        */



        const data = await Doctor.findOne({ _id: req.params.id }).populate(["files", "appointments", "events","messages"])
        // const data = await Doctor.findOne({ _id: req.params.id }).populate(["branchId", "cityId", "services","files", "appointments", "events","messages"])


        // .populate({
        //     path: 'files',
        //     select: 'fileName' // Sadece fileName alanını seçiyoruz
        // });


      


        res.status(200).send({
            error: false,
            data
            // data:{...data._doc, "files":[`${req.protocol}://${req.get("host")}/img/${data.files[0]}`,`${req.protocol}://${req.get("host")}/img/${data.files[1]}`]}
        
        })
    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Doctors"]
            #swagger.summary = "Update Doctor"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: { $ref: '#/definitions/Doctor' }
            }
        */

        const data = await Doctor.updateOne({ _id: req.params.id }, req.body, { runValidators: true })
        const dataNew = await Doctor.findOne({ _id: req.params.id }) 

        // فقط إذا كان هناك تغيير حقيقي في isApproved
        if (typeof req.body.isApproved !== "undefined" && EMAIL) {
          if (req.body.isApproved) {
            sendMail(
              EMAIL,
              "Account Confirmation",
              `
                  <h2>Doctor:</h2> <p>${dataNew?.title}. ${dataNew?.firstName} ${dataNew?.lastName}</p>
                  <h2>Time:</h2> <p>${(dataNew?.updatedAt)}</p>
          
                  <hr/>
                  <h2>Notification:</h2> <p>Your AlphaHeart account has been confirmed. You can now start using AlphaHeart</p>
              `
            )
          } else {
            sendMail(
              EMAIL,
              "Account Status Update",
              `
                  <h2>Doctor:</h2> <p>${dataNew?.title}. ${dataNew?.firstName} ${dataNew?.lastName}</p>
                  <h2>Time:</h2> <p>${(dataNew?.updatedAt)}</p>
          
                  <hr/>
                  <h2>Notification:</h2> <p>Your AlphaHeart account approval has been declined.</p>
              `
            )
          }
        }

        res.status(202).send({
          error: false,
          data,
          new: await Doctor.findOne({ _id: req.params.id })
        })
    },

    delete: async (req, res) => {
        /*
            #swagger.tags = ["Doctors"]
            #swagger.summary = "Delete Doctor"
        */

        const data = await Doctor.deleteOne({ _id: req.params.id })

        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data
        })
    },
}