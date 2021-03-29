/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
	try {
		// console.log(req.header('Authorization'));
		const token = req.cookies.auth_token;
		const decoded = jwt.verify(token, 'this is my new course');
		const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

		if (!user) {
			throw new Error();
		}

		req.token = token;
		req.user = user;
		next();
	} catch (err) {
		res.redirect('/login');
	}
};

module.exports = auth;