const createError = require('http-errors');
const { signAccessToken } = require('../config/jwt');
const bcrypt = require('bcryptjs');
const pool = require('../db');

//validation
const { loginSchema } = require('../config/joi');

module.exports = {
	login: async (req, res, next) => {
		try {
			//validate request
			const validationResult = await loginSchema.validateAsync(req.body);
			const { email, password } = validationResult;
			const studentPattern = /^[a-z]+.[a-z]+.@students.jkuat.ac.ke$/;
			const staffPattern = /^[a-z]+.[a-z]+.@staff.jkuat.ac.ke$/;
			const studentTest = studentPattern.test(email);
			const staffTest = staffPattern.test(email);
			if (!studentTest && !staffTest) {
				throw createError.BadRequest(
					'Please use the email provided by the school'
				);
			}
			//student
			if (studentTest) {
				//check email
				const student = await pool.query(
					'SELECT * FROM students WHERE email = $1',
					[email]
				);
				const classrep = await pool.query(
					'SELECT * FROM class_rep WHERE email = $1',
					[email]
				);
				const group_leader = await pool.query(
					'SELECT * FROM group_leader_view WHERE email = $1',
					[email]
				);
				if (student.rows.length === 0) {
					throw createError.NotFound('Invalid Email and Password Combination');
				}
				//compare passwords
				const isMatch = await bcrypt.compare(
					password,
					student.rows[0].passcode
				);

				if (!isMatch)
					throw createError.Unauthorized(
						'Invalid Email and Password Combination'
					);
				let accessToken;
				if (classrep.rows.length > 0) {
					accessToken = await signAccessToken(
						student.rows[0].reg_no,
						'classrep',
						student.rows[0].first_name
					);
				} else if (group_leader.rows.length > 0) {
					accessToken = await signAccessToken(
						student.rows[0].reg_no,
						'groupLeader',
						student.rows[0].first_name
					);
				} else {
					//  sign access token
					accessToken = await signAccessToken(
						student.rows[0].reg_no,
						'student',
						student.rows[0].first_name
					);
				}

				//send response
				res.json({ token: accessToken });
			}
			if (staffTest) {
				const lab_tech = await pool.query(
					'SELECT * FROM lab_tech WHERE email=$1',
					[email]
				);
				const lecturer = await pool.query(
					'SELECT * FROM lecturer WHERE email=$1',
					[email]
				);
				const cod = await pool.query('SELECT * FROM cod WHERE email=$1', [
					email,
				]);
				if (lab_tech.rows.length === 0 && lecturer.rows.length === 0) {
					throw createError.NotFound('Invalid Email and Password Combination');
				}
				if (lab_tech.rows.length > 0) {
					//compare passwords
					const isMatch = await bcrypt.compare(
						password,
						lab_tech.rows[0].passcode
					);

					if (!isMatch)
						throw createError.Unauthorized(
							'Invalid Email and Password Combination'
						);
					//  sign access token
					const accessToken = await signAccessToken(
						lab_tech.rows[0].labtech_id,
						'labtech',
						lab_tech.rows[0].first_name
					);
					//send response
					res.json({
						token: accessToken,
					});
				}
				if (lecturer.rows.length > 0) {
					//compare passwords
					const isMatch = await bcrypt.compare(
						password,
						lecturer.rows[0].passcode
					);

					if (!isMatch)
						throw createError.Unauthorized(
							'Invalid Email and Password Combination'
						);

					let accessToken;
					if (cod.rows.length > 0) {
						//  sign chair access token
						accessToken = await signAccessToken(
							lecturer.rows[0].lec_id,
							'cod',
							lecturer.rows[0].first_name
						);
					} else {
						//  sign lec access token
						accessToken = await signAccessToken(
							lecturer.rows[0].lec_id,
							'lecturer',
							lecturer.rows[0].first_name
						);
					}

					//send response
					res.json({
						token: accessToken,
					});
				}
			}
		} catch (error) {
			console.log(error.message);
			if (error.isJoi === true)
				return next(
					createError.BadRequest('Invalid Email and Password Combination')
				);
			next(error);
		}
	},
	getUser: async (req, res, next) => {
		try {
			const { id } = req.params;

			const studentPattern = /^ITE[0-9]{3}-[0-9]{4}-[0-9]{4}$/;
			const labtechPattern = /^dte[0-9]{3}-[0-9]{4}$/;
			const lecturerPattern = /^dte[0-9]{4}-[0-9]{4}$/;
			const studentTest = studentPattern.test(id);
			const labtechTest = labtechPattern.test(id);
			const lecturerTest = lecturerPattern.test(id);

			if (!studentTest && !labtechTest && !lecturerTest) {
				throw createError.BadRequest('invalid identification');
			}

			if (studentTest) {
				const { rows } = await pool.query(
					'SELECT * FROM student_view WHERE reg_no = $1',
					[id]
				);
				if (rows.length === 0) {
					throw createError(404, 'student not found');
				}
				const { reg_no, ...rest } = rows[0];
				res.json({ id: reg_no, ...rest });
			}
			if (labtechTest) {
				const { rows } = await pool.query(
					'SELECT * FROM lab_tech_view WHERE labtech_id = $1',
					[id]
				);
				if (rows.length === 0) {
					throw createError(404, 'labtech not found');
				}
				const { labtech_id, ...rest } = rows[0];
				res.json({ id: labtech_id, ...rest });
			}
			if (lecturerTest) {
				const { rows } = await pool.query(
					'SELECT * FROM lec_view WHERE lec_id = $1',
					[id]
				);
				if (rows.length === 0) {
					throw createError(404, 'lec not found');
				}
				const { lec_id, ...rest } = rows[0];
				res.json({ id: lec_id, ...rest });
			}
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
};
