const createError = require('http-errors');
const pool = require('../db');

module.exports = {
	getALLPracticals: async (req, res, next) => {
		try {
			const { rows } = await pool.query('SELECT * FROM practical');
			if (rows.length === 0) {
				throw createError(404, 'no practicals found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	getPracticalsByYear: async (req, res, next) => {
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
				'SELECT * FROM practical INNER JOIN units USING (unit_code) WHERE unit_year = $1',
				[students.rows[0].year_of_study]
			);
			if (rows.length === 0) {
				throw createError(404, 'practicals not found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	getPracticalByID: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { rows } = await pool.query(
				'SELECT * FROM practical WHERE practical_id = $1',
				[id]
			);
			if (rows.length === 0) {
				throw createError(404, 'practical not found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	addPractical: async (req, res, next) => {
		try {
			const { unit_code, labtech_id, prac_name, abstract } = req.body;
			if (!unit_code || !prac_name || !abstract || !labtech_id) {
				throw createError.BadRequest();
			}
			if (req.file == undefined) {
				throw createError.BadRequest('No file selected');
			}
			const filename = req.file.filename;
			const units = await pool.query(
				`SELECT * FROM units WHERE unit_code = $1`,
				[unit_code]
			);
			if (units.rows.length === 0) {
				throw createError.BadRequest('please use a valid unit code');
			}
			const { rows } = await pool.query(
				`INSERT INTO practical (unit_code,labtech_id,prac_name,abstract,lab_manual) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
				[unit_code, labtech_id, prac_name, abstract, filename]
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
	editPractical: async (req, res, next) => {
		try {
			const { prac_id } = req.params;
			const { unit_code, labtech_id, prac_name, abstract } = req.body;

			if (req.file == undefined) {
				next(createError.BadRequest('No file selected'));
			}

			if (!unit_code || !labtech_id || !prac_name || abstract) {
				throw createError.BadRequest('please input all fields');
			}
			const filename = req.file.filename;
			const { rows } = await pool.query(
				`UPDATE practical SET  unit_code=$1, labtech_id=$2, prac_name=$3, abstract=$4, lab_manual=$5 WHERE prac_id = $6 RETURNING *`,
				[unit_code, labtech_id, prac_name, abstract, filename, prac_id]
			);
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	deletePractical: async (req, res, next) => {
		try {
			const { prac_id } = req.params;
			const { rows } = await pool.query(
				`DELETE FROM practical WHERE prac_id = $1 RETURNING *`,
				[prac_id]
			);
			if (rows.length === 0) {
				throw createError(404, 'practical not found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
};
