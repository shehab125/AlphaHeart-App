"use strict"

// WeekDay Controller:

const WeekDay = require('../models/weekDay')

const Appointment = require('../models/appointment')
const Doctor = require('../models/doctor')
const { get } = require('mongoose')

module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["Cities"]
            #swagger.summary = "List Cities"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

        const data = await res.getModelList(WeekDay)

        // res.status(200).send({
        //     error: false,
        //     details: await res.getModelListDetails(WeekDay),
        //     data
        // })
        
        // FOR REACT PROJECT:
        res.status(200).send(data)
    },

    create: async (req, res) => {
        /*
            #swagger.tags = ["Cities"]
            #swagger.summary = "Create WeekDay"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: { $ref: '#/definitions/WeekDay' }
            }
        */

        try {
            // Validate required fields
            const requiredFields = ['doctorId', 'name', 'startHour', 'finishHour', 'appointmentDuration', 'startingDate', 'endingDate'];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({
                        error: true,
                        message: `${field} is required`
                    });
                }
            }

            // Validate time format
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(req.body.startHour) || !timeRegex.test(req.body.finishHour)) {
                return res.status(400).json({
                    error: true,
                    message: "Invalid time format. Use HH:mm format"
                });
            }

            // Validate lunch break times if provided
            if (req.body.lunchStart && req.body.lunchFinish) {
                if (!timeRegex.test(req.body.lunchStart) || !timeRegex.test(req.body.lunchFinish)) {
                    return res.status(400).json({
                        error: true,
                        message: "Invalid lunch break time format. Use HH:mm format"
                    });
                }
            }

            // Create the weekday
            const data = await WeekDay.create(req.body);

            // Generate appointments for the date range
            let getDaysArray = function(start, end) {
                let arr = []
                for(let dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
                    arr.push(new Date(dt));
                }
                return arr;
            };   

            let daylist = getDaysArray(req.body.startingDate, req.body.endingDate);
            const dayArray = daylist.map((v)=>v.toISOString().slice(0,10));

            function getDayName(dateStr, locale){
                let date = new Date(dateStr);
                return date.toLocaleDateString(locale, { weekday: 'long' });        
            }

            for(let i = 0; i < dayArray.length; i++){
                // Use 'en-US' to match English day names (e.g., 'Monday')
                // استخدم 'en-US' لمطابقة أسماء الأيام بالإنجليزية مثل 'Monday'
                const tagName = getDayName(dayArray[i], "en-US");

                if(!req.body.isHoliday && tagName === req.body.name){
                    const dayStart = req.body.startHour;
                    const dayEnd = req.body.finishHour;
                    // Use appointmentDuration as a number directly
                    // استخدم appointmentDuration كرقم مباشرة
                    const period = req.body.appointmentDuration;
        
                    if(req.body.lunchStart && req.body.lunchFinish){
                        const lunchBreakStart = req.body.lunchStart;
                        const lunchBreakEnd = req.body.lunchFinish;
    
                        const appoArray = divideDay(dayStart, dayEnd, period, lunchBreakStart, lunchBreakEnd);

                        for(let j = 0; j < appoArray.length; j++){
                            // Calculate timeEnd based on timeStart and period
                            // حساب وقت النهاية بناءً على وقت البداية ومدة الموعد
                            const [h, m] = appoArray[j].split(':').map(Number);
                            const endMinutes = h * 60 + m + period;
                            const endHour = String(Math.floor(endMinutes / 60)).padStart(2, '0');
                            const endMinute = String(endMinutes % 60).padStart(2, '0');
                            const timeEnd = `${endHour}:${endMinute}`;

                            const newApp = await Appointment.create({
                                doctorId: data.doctorId, 
                                date: dayArray[i],
                                timeStart: appoArray[j],
                                timeEnd: timeEnd,
                                insuranceType: "Private",
                                weekDay: data._id
                            });
                            await Doctor.updateOne(
                                {_id: data.doctorId}, 
                                {$push: {appointments: newApp._id}}
                            );
                        }
                    } else {
                        const appoArray = divideTimePeriod(dayStart, dayEnd, period);

                        for(let j = 0; j < appoArray.length; j++){
                            // Calculate timeEnd based on timeStart and period
                            // حساب وقت النهاية بناءً على وقت البداية ومدة الموعد
                            const [h, m] = appoArray[j].split(':').map(Number);
                            const endMinutes = h * 60 + m + period;
                            const endHour = String(Math.floor(endMinutes / 60)).padStart(2, '0');
                            const endMinute = String(endMinutes % 60).padStart(2, '0');
                            const timeEnd = `${endHour}:${endMinute}`;

                            const newApp = await Appointment.create({
                                doctorId: data.doctorId, 
                                date: dayArray[i],
                                timeStart: appoArray[j],
                                timeEnd: timeEnd,
                                insuranceType: "Private",
                                weekDay: data._id
                            });
                            await Doctor.updateOne(
                                {_id: data.doctorId}, 
                                {$push: {appointments: newApp._id}}
                            );
                        }
                    }  
                }
            }

            res.status(201).send({
                error: false,
                data
            });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: error.message
            });
        }
    },

    read: async (req, res) => {
        /*
            #swagger.tags = ["Cities"]
            #swagger.summary = "Get Single WeekDay"
        */

        const data = await WeekDay.findOne({ _id: req.params.id })

        res.status(200).send({
            error: false,
            data
        })
    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Cities"]
            #swagger.summary = "Update WeekDay"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: { $ref: '#/definitions/WeekDay' }
            }
        */

        const data = await WeekDay.updateOne({ _id: req.params.id }, req.body, { runValidators: true })

        res.status(202).send({
            error: false,
            data,
            new: await WeekDay.findOne({ _id: req.params.id })
        })
    },

    delete: async (req, res) => {
        /*
            #swagger.tags = ["Cities"]
            #swagger.summary = "Delete WeekDay"
        */

        const data = await WeekDay.deleteOne({ _id: req.params.id })
        await Appointment.deleteMany({ weekDay: req.params.id });
        
        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data
        })
    },

    getDoctorWeekDays: async (req, res) => {
        try {
            const { doctorId } = req.params;
            const weekDays = await WeekDay.find({ doctorId });
            
            if (!weekDays || weekDays.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No working hours found for this doctor'
                });
            }

            res.status(200).json({
                success: true,
                data: weekDays
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching doctor working hours',
                error: error.message
            });
        }
    }
}

// Helper functions
function divideDay(dayStart, dayEnd, period, breakStart, breakEnd) {
    if (!dayStart || !dayEnd || !period || !breakStart || !breakEnd) {
        console.error('All parameters are required.');
        return [];
    }

    const [startHour, startMinute] = dayStart.split(':').map(Number);
    const [endHour, endMinute] = dayEnd.split(':').map(Number);
    const [breakStartHour, breakStartMinute] = breakStart.split(':').map(Number);
    const [breakEndHour, breakEndMinute] = breakEnd.split(':').map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const breakStartTotalMinutes = breakStartHour * 60 + breakStartMinute;
    const breakEndTotalMinutes = breakEndHour * 60 + breakEndMinute;

    const result = [];

    for (let currentMinutes = startTotalMinutes; currentMinutes < breakStartTotalMinutes; currentMinutes += period) {
        const currentHour = Math.floor(currentMinutes / 60);
        const currentMinute = currentMinutes % 60;
        const formattedTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        result.push(formattedTime);
    }

    for (let currentMinutes = breakEndTotalMinutes; currentMinutes < endTotalMinutes; currentMinutes += period) {
        const currentHour = Math.floor(currentMinutes / 60);
        const currentMinute = currentMinutes % 60;
        const formattedTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        result.push(formattedTime);
    }

    return result;
}

function divideTimePeriod(startTime, endTime, period) {
    if (!startTime || !endTime) {
        console.error('Both startTime and endTime are required.');
        return [];
    }

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    const result = [startTime];

    for (let currentMinutes = startTotalMinutes + period; currentMinutes < endTotalMinutes; currentMinutes += period) {
        const currentHour = Math.floor(currentMinutes / 60);
        const currentMinute = currentMinutes % 60;
        const formattedTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        result.push(formattedTime);
    }

    return result;
}
