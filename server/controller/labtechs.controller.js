const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { labtechSchema } = require('../config/joi');

module.exports = {
	getALLLabtechs: async (req, res, next) => {
		try {
			const { rows } = await pool.query('SELECT * FROM lab_tech_view');
			if (rows.length === 0) {
				throw createError(404, 'no labtechs found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	getLabtechByID: async (req, res, next) => {
		try {
			const { labtech_id } = req.params;
			const { rows } = await pool.query(
				'SELECT * FROM lab_tech_view WHERE labtech_id = $1',
				[labtech_id]
			);
			if (rows.length === 0) {
				throw createError(404, 'labtech not found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	addLabtech: async (req, res, next) => {
		try {
			//validate request
			const validationResult = await labtechSchema.validateAsync(req.body);
			const { labtech_id, last_name, first_name, email, passcode } =
				validationResult;
			// check for existing student
			const { rows } = await pool.query(
				'SELECT * FROM lab_tech WHERE labtech_id=$1',
				[labtech_id]
			);

			if (rows.length > 0)
				throw createError.Conflict(`${labtech_id} is already registered`);
			// insert new user in db
			const hashedPassword = await bcrypt.hash(passcode, 14);
			const labtech = await pool.query(
				'INSERT INTO lab_tech(labtech_id,last_name,first_name,email,passcode) VALUES ($1,$2,$3,$4,$5) RETURNING *',
				[labtech_id, last_name, first_name, email, hashedPassword]
			);
			// sign token and send response
			res.json(labtech.rows);
		} catch (err) {
			if (err.isJoi === true) err.status = 422;
			next(err);
		}
	},
	editLabtech: async (req, res, next) => {
		try {
			const { labtech_id } = req.params;
			const { passcode } = req.body;

			if (!passcode) {
				throw createError.BadRequest();
			}
			const { rows } = await pool.query(
				'SELECT * FROM lab_tech WHERE labtech_id=$1',
				[labtech_id]
			);

			if (rows.length === 0) {
				throw createError(404, 'labtech not found');
			}
			const hashedPassword = await bcrypt.hash(passcode, 14);
			const lab_tech = await pool.query(
				`UPDATE lab_tech SET passcode=$1 WHERE labtech_id = $2 RETURNING *`,
				[hashedPassword, labtech_id]
			);

			res.send(lab_tech.rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	deleteLabtech: async (req, res, next) => {
		try {
			const { labtech_id } = req.params;
			const { rows } = await pool.query(
				`DELETE FROM lab_tech WHERE labtech_id = $1 RETURNING *`,
				[labtech_id]
			);
			if (rows.length === 0) {
				throw createError(404, 'labtech not found');
			}
			const { passcode, ...rest } = rows[0];
			res.json({ ...rest });
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
};
