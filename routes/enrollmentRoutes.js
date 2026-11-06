const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { auth, student } = require('../middleware/authMiddleware');

router.post('/:courseId/enroll', auth, student, enrollmentController.enroll);
router.get('/', auth, student, enrollmentController.index);

module.exports = router;
