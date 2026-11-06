const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { auth, teacher, student } = require('../middleware/authMiddleware');

router.get('/', auth, student, courseController.index);
router.get('/create', auth, teacher, courseController.showCreate);
router.post('/create', auth, teacher, courseController.create);
router.get('/:id/edit', auth, teacher, courseController.showEdit);
router.put('/:id', auth, teacher, courseController.update);
router.delete('/:id', auth, teacher, courseController.delete);
router.get('/:id', auth, courseController.show);

module.exports = router;
