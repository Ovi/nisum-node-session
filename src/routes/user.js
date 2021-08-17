const router = require('express').Router();

const auth = require('../middleware/auth');
const controller = require('../controllers/user');

// get user's own profile
router.get('/', auth.USER, controller.getUser);

// register user
router.post('/register', controller.registerUser);

// login user
router.post('/login', controller.loginUser);

// update subscription
router.post('/update-subscription', auth.USER, controller.updateSubscription);

module.exports = router;
