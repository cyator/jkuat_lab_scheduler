const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { lecturerSchema } = require('../config/joi');

module.exports = {
	getAllLecturers: async (req, res, next) => {
		try {
			const { rows } = await pool.query('SELECT * FROM lec_view');
			if (rows.length === 0) {
				throw createError(404, 'no lecs found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	getLecturerByID: async (req, res, next) => {
		try {
			const { lec_id } = req.params;
			const { rows } = await pool.query(
				'SELECT * FROM lec_view WHERE lec_id = $1',
				[lec_id]
			);
			if (rows.length === 0) {
				throw createError(404, 'lec not found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	addLecturer: async (req, res, next) => {
		try {
			//validate request
			const validationResult = await lecturerSchema.validateAsync(req.body);
			const { lec_id, last_name, first_name, email, passcode } =
				validationResult;
			// check for existing student
			const { rows } = await pool.query(
				'SELECT * FROM lecturer WHERE lec_id=$1',
				[lec_id]
			);

			if (rows.length > 0)
				throw createError.Conflict(`${lec_id} is already registered`);
			// insert new user in db
			const hashedPassword = await bcrypt.hash(passcode, 14);
			const lec = await pool.query(
				'INSERT INTO lecturer(lec_id,last_name,first_name,email,passcode) VALUES ($1,$2,$3,$4,$5) RETURNING *',
				[lec_id, last_name, first_name, email, hashedPassword]
			);
			// sign token and send response
			res.json(lec.rows);
		} catch (err) {
			if (err.isJoi === true) err.status = 422;
			next(err);
		}
	},
	editLecturer: async (req, res, next) => {
		try {
			const { lec_id } = req.params;
			const { passcode } = req.body;

			if (!passcode) {
				throw createError.BadRequest();
			}
			const { rows } = await pool.query(
				'SELECT * FROM lecturer WHERE lec_id=$1',
				[lec_id]
			);

			if (rows.length === 0) {
				throw createError(404, 'lec not found');
			}
			const hashedPassword = await bcrypt.hash(passcode, 14);
			const lec = await pool.query(
				`UPDATE lecturer SET passcode=$1 WHERE lec_id = $2 RETURNING *`,
				[hashedPassword, lec_id]
			);

			res.send(lec.rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	deleteLecturer: async (req, res, next) => {
		try {
			const { lec_id } = req.params;
			const { rows } = await pool.query(
				`DELETE FROM lecturer WHERE lec_id = $1 RETURNING *`,
				[lec_id]
			);
			if (rows.length === 0) {
				throw createError(404, 'lec not found');
			}
			const { passcode, ...rest } = rows[0];
			res.json({ ...rest });
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
};
