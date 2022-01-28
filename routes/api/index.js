const router = require('express').Router();

const thoughtsRoutes = require('./thought-routes');
const usersRoutes = require('./user-routes');

router.use('/users', usersRoutes);

router.use('/thoughts', thoughtsRoutes);

module.exports = router;