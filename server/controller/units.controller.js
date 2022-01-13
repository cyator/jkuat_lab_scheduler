const createError = require('http-errors');
const pool = require('../db');

module.exports = {
	getALLUnits: async (req, res, next) => {
		try {
			const { rows } = await pool.query('SELECT * FROM units');
			if (rows.length === 0) {
				throw createError(404, 'no units found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	getUnitByYear: async (req, res, next) => {
		try {
			const { reg_no } = req.params;
			const students = await pool.query(
				'SELECT year_of_study FROM student_view WHERE reg_no = $1',
				[reg_no]
			);
			if (students.rows.length === 0) {
				throw createError(404, 'student not found');
			}
			const { rows } = await pool.query(
				'SELECT * FROM units WHERE unit_year = $1',
				[students.rows[0].year_of_study]
			);
			if (rows.length === 0) {
				throw createError(404, 'unit not found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	getUnitByID: async (req, res, next) => {
		try {
			const { unit_code } = req.params;
			const { rows } = await pool.query(
				'SELECT * FROM units WHERE unit_code = $1',
				[unit_code]
			);
			if (rows.length === 0) {
				throw createError(404, 'unit not found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	addUnit: async (req, res, next) => {
		try {
			const { unit_code, unit_name, lec_id } = req.body;
			if (!unit_code || !unit_name || !lec_id) {
				throw createError.BadRequest();
			}
			const { rows } = await pool.query(
				`INSERT INTO units (unit_code,unit_name,lec_id) VALUES ($1,$2,$3) RETURNING *`,
				[unit_code, unit_name, lec_id]
			);
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			if (error.code === '23505') {
				return next(createError(400, error.detail));
			}
			next(error);
		}
	},
	editUnit: async (req, res, next) => {
		try {
			const { unit_code } = req.params;
			const { unit_name, lec_id } = req.body;

			if (!unit_name || !lec_id) {
				throw createError.BadRequest('please input all fields');
			}

			const { rows } = await pool.query(
				`UPDATE units SET  unit_name=$1, lec_id=$2, WHERE unit_code = $3 RETURNING *`,
				[unit_name, lec_id, unit_code]
			);
			if (rows.length === 0) {
				throw createError(404, 'unit not found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	deleteUnit: async (req, res, next) => {
		try {
			const { unit_code } = req.params;
			const { rows } = await pool.query(
				`DELETE FROM units WHERE unit_code = $1 RETURNING *`,
				[unit_code]
			);
			if (rows.length === 0) {
				throw createError(404, 'unit not found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
};
