const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const restrictTo = require('../middlewares/restrictTo');

router.post('/signup', userController.signup);
router.post('/login', userController.login);


router.get('/', auth, restrictTo('admin'), async (req, res) => {
  
});

module.exports = router;
