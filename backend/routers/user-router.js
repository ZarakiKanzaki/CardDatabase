/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const User = require('../models/user.js');
const auth = require('../middleware/auth.js');

const router = new express.Router();

router.get('/users', auth, async (req, res) => {
	const superU = await Role.findOne({ description: 'superUser' }).populate('roleId');
	const role = await Role.findById(req.user.roleId);
	const users = role.description.indexOf('superUser') >= 0
		? await User.find({}).populate('roleId')
		: await User.find({ roleId: { $ne: superU._id } }).populate('roleId');
	if (role.description.indexOf('student') >= 0) {
		res.render('page_error', {
			code: 403,
			message: 'Non sei autorizzato ad accedere a questa pagina.',
		});
	} else {
		res.render('student-dashboard', {
			breadcrumb: [{ active: true, name: 'Utenti registrati' }],
			title: 'Tutti gli utenti',
			user: req.user,
			users,
			content() {
				return 'admin/allUsers';
			},
		});
	}
});

// GET: /users
router.get('/users/me', auth, async (req, res) => {
	const _id = req.cookies.usr_id;
	try {
		const user = await User.findById(_id);
		if (!user) {
			return res.status(404).send();
		}
		if (req.query.editMode === 'true') {
			res.render('student-dashboard', {
				breadcrumb: [{ active: true, name: 'modifica profilo' }],
				title: 'Modifica profilo',
				user: req.user,

				content() {
					return 'base/editProfile';
				},
			});
		} else {
			res.render('student-dashboard', {
				breadcrumb: [{ active: true, name: 'Il mio Profilo' }],
				title: 'Il mio profilo!',
				user: req.user,
				content() {
					return 'base/profile';
				},
			});
		}
	} catch (e) {
		res.status(500).send(e);
	}
});

// GET: /users/5
router.get('/users/:id', async (req, res) => {
	const _id = req.params.id;
	try {
		const user = await User.findById(_id);
		if (!user) {
			return res.status(404).send();
		}
		res.status(200).send(user);
	} catch (e) {
		res.status(500).send(e);
	}
});

// POST: /users
// FUNCTION to signup
router.post('/users', async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (e) {
		// console.log(e);
		res.status(400).send(e);
	}
});

// PATCH /users/5
router.patch('/users/me', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'surname', 'email', 'password', 'imgSource', 'enabled', 'fiscalCode'];
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' });
	}

	try {
		const user = await User.findOne({ email: req.body.email });
		updates.forEach((update) => {
			user[update] = req.body[update];
		});
		await user.save();

		res.send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

// DELETE users/5
router.delete('/users/me', auth, async (req, res) => {
	try {
		await req.user.remove();
		res.send(req.user);
	} catch (e) {
		res.status(500).send();
	}
});

// GET /login
router.get('/forgotPassword', async (req, res) => {
	res.render('forgot-password', {
	});
});



// LOGIN user
router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		res.cookie('auth_token', token);
		res.cookie('usr_id', user._id);
		req.user = user.toJSON();
		res.redirect('/');
	} catch (e) {
		// console.log(e);
		res.send({
			error: e,
		});
	}
});

// LOGOUT user
router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);

		await req.user.save();

		res.clearCookie('auth_token');
		res.clearCookie('usr_id');

		res.redirect('/login');
	} catch (error) {
		res.status(500).send();
	}
});

// LOGOUT all instaces of user
router.post('/users/logoutAll', auth, async (req, res) => {
	try {
		req.user.tokens = [];

		await req.user.save();

		res.clearCookie('auth_token');
		res.clearCookie('usr_id');

		res.send();
	} catch (error) {
		res.status(500).send();
	}
});

module.exports = router;
