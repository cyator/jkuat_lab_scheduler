require('dotenv').config;
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
	signAccessToken: (userId, role, name) => {
		return new Promise((resolve, reject) => {
			const payload = {
				role,
				name,
			};
			const secret = process.env.ACCESS_TOKEN_SECRET;
			const options = {
				expiresIn: '7d',
				issuer: 'localhost:5000',
				audience: userId,
			};
			jwt.sign(payload, secret, options, (err, token) => {
				if (err) {
					console.log(err.message);
					return reject(createError.InternalServerError());
				}

				resolve(token);
			});
		});
	},
	verifyToken: (role) => (req, res, next) => {
		if (!req.headers['authorization']) return next(createError.Unauthorized());
		const authHeader = req.headers['authorization'].split(' ');
		const accessToken = authHeader[1];
		// const { accessToken } = req.cookies;
		if (!accessToken) return next(createError.Unauthorized());
		jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
			if (err) {
				console.log(err.message);
				const message =
					err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
				return next(createError.Unauthorized(message));
			}
			switch (role) {
				case 'all':
					req.payload = payload;
					next();
					return;
				case 'student':
					const isStudent =
						payload.role === 'student' ||
						payload.role === 'groupLeader' ||
						payload.role === 'classrep';
					if (!isStudent) {
						throw createError.Unauthorized(
							'you do not have permission to access this resource'
						);
					}
					req.payload = payload;
					next();
					return;
				case 'groupLeader':
					const isgroupLeader = payload.role === 'groupLeader';
					if (!isgroupLeader) {
						throw createError.Unauthorized(
							'you do not have permission to access this resource'
						);
					}
					req.payload = payload;
					next();
					return;
				case 'classrep':
					const isClassrep = payload.role === 'classrep';
					if (!isClassrep) {
						throw createError.Unauthorized(
							'you do not have permission to access this resource'
						);
					}
					req.payload = payload;
					next();
					return;
				case 'staff':
					const isStaff =
						payload.role === 'lecturer' ||
						payload.role === 'labtech' ||
						payload.role === 'cod';
					if (!isStaff) {
						throw createError.Unauthorized(
							'you do not have permission to access this resource'
						);
					}
					req.payload = payload;
					next();
					return;
				case 'lecturer':
					const isLecturer =
						payload.role === 'lecturer' || payload.role === 'cod';
					if (!isLecturer) {
						throw createError.Unauthorized(
							'you do not have permission to access this resource'
						);
					}
					req.payload = payload;
					next();
					return;
				case 'labtech':
					const isLabtech = payload.role === 'labtech';
					if (!isLabtech) {
						throw createError.Unauthorized(
							'you do not have permission to access this resource'
						);
					}
					req.payload = payload;
					next();
					return;
				case 'cod':
					const isChair = payload.role === 'cod';
					if (!isChair) {
						throw createError.Unauthorized(
							'you do not have permission to access this resource'
						);
					}
					req.payload = payload;
					next();
					return;
				default:
					throw createError.Unauthorized(
						'you do not have permission to access this resource'
					);
			}
		});
	},
};
