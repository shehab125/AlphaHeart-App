"use strict"

const passwordEncrypt = require('./passwordEncrypt')

module.exports = function (next) {
    // For Mongoose pre-save
    if (this && this.isNew !== undefined) {
        // passwordEncrypt:
        if (this.password) {
            this.password = passwordEncrypt(this.password)
        }
        // email lowercase:
        if (this.email) {
            this.email = this.email.toLowerCase()
        }
        if (typeof next === "function") return next();
        return;
    }

    // For Mongoose updateOne
    if (this && this.getUpdate) {
        const update = this.getUpdate();
        if (update && update.$set && update.$set.password) {
            update.$set.password = passwordEncrypt(update.$set.password);
        }
        if (update && update.$set && update.$set.email) {
            update.$set.email = update.$set.email.toLowerCase();
        }
        if (typeof next === "function") return next();
        return;
    }

    // For Express middleware
    return function (req, res, next) {
        if (req.body?.password) {
            req.body.password = passwordEncrypt(req.body.password)
        }
        if (req.body?.email) {
            req.body.email = req.body.email.toLowerCase()
        }
        next();
    }
}