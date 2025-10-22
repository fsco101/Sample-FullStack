const express = require('express')
const router = express.Router();

const { newOrder,
		

	} = require('../controllers/order')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.route('/order/new').post(isAuthenticatedUser, newOrder);

module.exports = router;