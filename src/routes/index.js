const router = require('express').Router();
const userRoutes = require('./user');
const contentRoutes = require('./content');

router.use('/user', userRoutes);
router.use('/content', contentRoutes);

module.exports = router;
