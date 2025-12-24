const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, roleCheck('ADMIN'), userController.getUsers);
router.patch('/:id', auth, roleCheck('ADMIN'), userController.updateUser);

module.exports = router;
