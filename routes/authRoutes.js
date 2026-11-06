const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { guest, auth } = require('../middleware/authMiddleware');

router.get('/login', guest, authController.showLogin);
router.post('/login', guest, authController.login);
router.get('/register', guest, authController.showRegister);
router.post('/register', guest, authController.register);
router.get('/logout', auth, authController.logout);

module.exports = router;
