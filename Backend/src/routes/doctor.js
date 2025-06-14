const router = require('express').Router();
const Doctor = require('../controllers/doctor');

router.route('/')
  .get(Doctor.list)
  .post(Doctor.create);

router.route('/:id')
  .get(Doctor.read)
  .put(Doctor.update) // Remove upload middleware
  .patch(Doctor.update) // Remove upload middleware
  .delete(Doctor.delete);

module.exports = router;