const router = require('express').Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/content');

router.get('/', auth.USER, controller.getContent);

module.exports = router;
