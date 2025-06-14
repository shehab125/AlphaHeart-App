"use strict"


// app.use(authentication):

const Token = require('../models/token')

module.exports = async (req, res, next) => {
    console.log("Authentication middleware reached!");
    
    const auth = req.headers?.authorization || null
    const tokenKey = auth ? auth.split(' ') : null
  
    console.log("Token key found:", !!tokenKey);
    if(tokenKey && tokenKey[0] == 'Token'){
        console.log("Token format is correct.");
        const tokenData = await Token.findOne({ token: tokenKey[1] })

        console.log("Token data found:", !!tokenData);
        if (tokenData) {
            console.log("Token user type:", tokenData.userType);
            let userModel;
            try {
                userModel = require("../models/"+tokenData.userType);
                console.log("User model required successfully.");
            } catch (error) {
                console.error("Error requiring user model:", error);
                return next(error);
            }

            try {
                req.user = await userModel.findOne({_id:tokenData.userId});
                console.log("User found via token:", !!req.user);
                if (req.user) req.user.userType = tokenData.userType;
                console.log("User object attached to request.");
            } catch (error) {
                console.error("Error finding user via token:", error);
                return next(error);
            }
        }
    }
//     if(tokenKey && tokenKey[0] == 'Token'){
//     const tokenData = await Token.findOne({ token: tokenKey[1] }).populate('userId')
//     req.user = tokenData ? tokenData.userId : null
// }

    console.log("Authentication middleware finished. Calling next().");
    next()
}

// const auth = req.headers?.authorization || null
// const tokenKey = auth ? auth.split(' ') : null

// if(tokenKey && tokenKey[0] == 'Token'){
//     const tokenData = await Token.findOne({ token: tokenKey[1] }).populate('userId')
//     req.user = tokenData ? tokenData.userId : null
// }